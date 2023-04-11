export default function step<F extends Function>(
  name: string,
  executeFunction: F,
): F {
  return ((...params: any[]) => {
    console.log(name);

    return executeFunction.apply(null, params);
  }) as any;
}

export class Process {
  private stepsWithDependencies: {step: Function, dependenciesIndex: number[]}[];

  constructor() {
    this.stepsWithDependencies = [];
  }

  addStep(step: Function, dependencies: Function[] = []) {
    const dependenciesIndex: number[] = [];
    for (const dependency of dependencies) {
      let found = false;
      for (let i = 0, length = this.stepsWithDependencies.length; i < length; i++) {
        const stepWithDependencies = this.stepsWithDependencies[i];

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

    this.stepsWithDependencies.push({ step, dependenciesIndex });
  }

  async process() {
    const results = [];
    let result = null;

    for (const stepWithDependencies of this.stepsWithDependencies) {
      const params: any[] = [];

      for (const dependencyIndex of stepWithDependencies.dependenciesIndex) {
        params.push(results[dependencyIndex]);
      }

      result = stepWithDependencies.step.apply(null, params);

      if (result instanceof Promise) {
        results.push(await result);
      } else {
        results.push(result);
      }
    }

    return result;
  }
}
