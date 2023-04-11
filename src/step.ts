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

    return this.executeFunction.apply(null, params);
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

  async process() {
    const results = [];
    let result = null;

    for (const stepWithDependencies of this.stepsFlow) {
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
    }

    return result;
  }
}
