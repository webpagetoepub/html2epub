/* eslint-disable @typescript-eslint/no-explicit-any */

const TEMPLATE_ERROR_MESSAGE = '[ERROR] Error on "%s"';

export class Step {
  name: string;
  private executeFunction: (...params: any[]) => any;

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
}

export class Process {
  private stepsFlow: {step: Step, dependenciesIndex: number[]}[];

  constructor() {
    this.stepsFlow = [];
  }

  addStep(step: Step, dependencies: Step[] = []) {
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

  async process(callbackStep: (currentStep: number) => void, callbackLength: (length: number) => void) {
    const length = this.stepsFlow.length;
    const results = [];
    let result = null;

    callbackLength(length);
    for (let i = 0; i < length; i++) {
      const stepWithDependencies = this.stepsFlow[i];
      const params: any[] = [];

      for (const dependencyIndex of stepWithDependencies.dependenciesIndex) {
        params.push(results[dependencyIndex]);
      }

      const step = stepWithDependencies.step;
      result = step.run(...params);

      if (result instanceof Promise) {
        results.push(await result);
      } else {
        results.push(result);
      }

      callbackStep(i + 1);
    }

    return result;
  }
}
