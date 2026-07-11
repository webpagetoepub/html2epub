import { Logger } from "./logger";

const TEMPLATE_ERROR_MESSAGE = '[ERROR] Error on "%s"';

// The pipeline is heterogeneous and index-addressed: a step's params are pulled
// from a mixed `unknown[]` of prior results by runtime index, which TypeScript
// cannot statically match to a step's declared parameter tuple. Steps are stored
// through their universal supertype `Step<never[], unknown>`, and this type marks
// the single place where that erasure is made explicit (see Process.process).
// Every step still exposes its real arg/return types to direct callers.
type StepFunction = (...params: unknown[]) => unknown;

export class Step<TArgs extends unknown[] = never[], TResult = unknown> {
  readonly name: string;
  private readonly execute: (...params: TArgs) => TResult;

  constructor(name: string, execute: (...params: TArgs) => TResult) {
    this.name = name;
    this.execute = execute;
  }

  run(...params: TArgs): TResult {
    return this.execute(...params);
  }

  getStepCount(): number {
    return 1;
  }
}

export class SubProcessStep extends Step {
  private readonly processFactory: (...params: never[]) => Process;

  constructor(name: string, processFactory: (...params: never[]) => Process) {
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    super(name, () => {});
    this.processFactory = processFactory;
  }

  override run(...args: unknown[]): unknown {
    const [callbackStepCompleted, logger, ...params] = args;
    return (
      this.processFactory as StepFunction as (...params: unknown[]) => Process
    )(...params).process(callbackStepCompleted as () => void, logger as Logger);
  }

  getStepCount(): number {
    return this.processFactory().getLength() + 1;
  }
}

export class Process {
  private stepsFlow: { step: Step; dependenciesIndex: number[] }[];

  constructor(steps: { step: Step; dependencies?: Step[] }[]) {
    this.stepsFlow = [];
    steps.forEach((step) => this.addStep(step.step, step.dependencies));
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
        const dependenciesNames = dependencies.map(
          (dependency) => dependency.name,
        );
        throw new Error(
          `Failed to create execution dependency. Step "${step.name}" depends on: ${dependenciesNames}.`,
        );
      }
    }

    this.stepsFlow.push({ step, dependenciesIndex });
  }

  getLength(): number {
    return this.stepsFlow.reduce(
      (sum, { step }) => sum + step.getStepCount(),
      0,
    );
  }

  async process(
    callbackStepCompleted: () => void,
    logger: Logger,
  ): Promise<unknown> {
    const results: unknown[] = [];
    let result: unknown = null;

    for (const { step, dependenciesIndex } of this.stepsFlow) {
      const params: unknown[] = dependenciesIndex.map((idx) => results[idx]);

      logger.log(step.name);

      try {
        if (step instanceof SubProcessStep) {
          result = step.run(callbackStepCompleted, logger, ...params);
        } else {
          result = (step.run as StepFunction)(...params);
        }

        if (result instanceof Promise) {
          results.push(await result);
        } else {
          results.push(result);
        }
      } catch (error) {
        const message = TEMPLATE_ERROR_MESSAGE.replace("%s", step.name);
        logger.error(message);
        throw error;
      }

      callbackStepCompleted();
    }

    return result;
  }
}
