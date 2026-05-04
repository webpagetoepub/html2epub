/* eslint-disable @typescript-eslint/no-explicit-any */

const TEMPLATE_ERROR_MESSAGE = '[ERROR] Error on "%s"';

export class Step {
  readonly name: string;
  private readonly executeFunction: (...params: any[]) => any;

  constructor(name: string, executeFunction: (...params: any[]) => any) {
    this.name = name;
    this.executeFunction = executeFunction;
  }

  run(...params: any[]) {
    if (this.name) {
      console.log(this.name);
    }

    try {
      return this.executeFunction(...params);
    } catch (error) {
      const message = TEMPLATE_ERROR_MESSAGE.replace('%s', this.name);
      console.error(message);

      throw error;
    }
  }

  getStepCount() {
    return 1;
  }
}

export class SubProcessStep extends Step {
  private readonly processFactory: (...params: any[]) => Process;

  constructor(name: string, processFactory: (...params: any[]) => Process) {
    super(name, () => {});
    this.processFactory = processFactory;
  }

  run(callbackStep: (currentStep: number) => void, ...params: any[]) {
    if (this.name) {
      console.log(this.name);
    }

    try {
      return this.processFactory(...params).process(callbackStep, () => {});
    } catch (error) {
      const message = TEMPLATE_ERROR_MESSAGE.replace('%s', this.name);
      console.error(message);

      throw error;
    }
  }

  getStepCount() {
    return this.processFactory().getLength();
  }
}

export class Process {
  private stepsFlow: {step: Step, dependenciesIndex: number[]}[];

  constructor(steps: {step: Step, dependencies?: Step[]}[]) {
    this.stepsFlow = [];
    steps.forEach(step => this.addStep(step.step, step.dependencies));
  }

  private addStep(step: Step, dependencies: Step[] = []) {
    const dependenciesIndex: number[] = [];
    for (const dependency of dependencies) {
      let found = false;
      for (let i = 0, length = this.stepsFlow.length; i < length; i++) {
        const stepWithDependencies = this.stepsFlow[i];

        if (dependency === stepWithDependencies.step) {
          dependenciesIndex.push(i);
          found = true;
          break;
        }
      }

      if (!found) {
        const dependenciesNames = dependencies.map(dependency => dependency.name);
        throw new Error(`Failed to create execution dependency. Step "${step.name}" depends on: ${dependenciesNames}.`);
      }
    }

    this.stepsFlow.push({ step, dependenciesIndex });
  }

  getLength(): number {
    return this.stepsFlow.reduce((sum, { step }) => sum + step.getStepCount(), 0);
  }

  async process(callbackStep: (currentStep: number) => void, callbackLength: (length: number) => void) {
    const length = this.getLength();
    const results: any[] = [];
    let result: any = null;
    let offset = 0;

    callbackLength(length);
    for (const { step, dependenciesIndex } of this.stepsFlow) {
      const params: any[] = dependenciesIndex.map(idx => results[idx]);

      if (step instanceof SubProcessStep) {
        const capturedOffset = offset;
        result = step.run(
          (subStep) => callbackStep(capturedOffset + subStep),
          ...params,
        );
      } else {
        result = step.run(...params);
      }

      if (result instanceof Promise) {
        results.push(await result);
      } else {
        results.push(result);
      }

      offset += step.getStepCount();

      if (!(step instanceof SubProcessStep)) {
        callbackStep(offset);
      }
    }

    return result;
  }
}
