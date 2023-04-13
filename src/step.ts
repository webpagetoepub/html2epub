const TEMPLATE_ERROR_MESSAGE = '[ERROR] Error on "%s"';

export class Step {
  private name: string;
  private executeFunction: Function;

  constructor(name: string, executeFunction: Function) {
    this.name = name;
    this.executeFunction = executeFunction;
  }

  run(...params: any[]) {
    if (this.name) {
      console.log(this.name);
    }

    try {
      return this.executeFunction.apply(null, params);
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
        throw new Error('Failed to create execution dependency.');
      }
    }

    this.stepsFlow.push({ step, dependenciesIndex });
  }

  async process(callbackStep: Function, callbackLength: Function) {
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
      result = step.run.apply(step, params);

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
