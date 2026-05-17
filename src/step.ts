/* eslint-disable @typescript-eslint/no-explicit-any */

import { Logger } from './logger';

const TEMPLATE_ERROR_MESSAGE = '[ERROR] Error on "%s"';

export class Step {
  readonly name: string;
  private readonly executeFunction: (...params: any[]) => any;

  constructor(name: string, executeFunction: (...params: any[]) => any) {
    this.name = name;
    this.executeFunction = executeFunction;
  }

  run(...params: any[]) {
    return this.executeFunction(...params);
  }

  getStepCount() {
    return 1;
  }
}

export class SubProcessStep extends Step {
  private readonly processFactory: (...params: any[]) => Process;

  constructor(name: string, processFactory: (...params: any[]) => Process) {
    /* eslint-disable @typescript-eslint/no-empty-function */
    super(name, () => {});
    this.processFactory = processFactory;
  }

  override run(...args: any[]) {
    const [callbackStepCompleted, logger, ...params] = args;
    return this.processFactory(...params).process(callbackStepCompleted, logger);
  }

  getStepCount() {
    return this.processFactory().getLength() + 1;
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

  async process(callbackStepCompleted: () => void, logger: Logger) {
    const results: any[] = [];
    let result: any = null;

    for (const { step, dependenciesIndex } of this.stepsFlow) {
      const params: any[] = dependenciesIndex.map(idx => results[idx]);

      logger.log(step.name);

      try {
        if (step instanceof SubProcessStep) {
          result = step.run(callbackStepCompleted, logger, ...params);
        } else {
          result = step.run(...params);
        }

        if (result instanceof Promise) {
          results.push(await result);
        } else {
          results.push(result);
        }
      } catch (error) {
        const message = TEMPLATE_ERROR_MESSAGE.replace('%s', step.name);
        logger.error(message);
        throw error;
      }

      callbackStepCompleted();
    }

    return result;
  }
}
