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
  private steps: Function[];

  constructor() {
    this.steps = [];
  }

  addStep(step: Function) {
    this.steps.push(step);
  }

  process(param: any) {
    for (const step of this.steps) {
      step(param);
    }
  }
}
