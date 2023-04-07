export default function step<F extends Function>(
  name: string,
  executeFunction: F,
): F {
  return ((...params: any[]) => {
    console.log(name);

    return executeFunction.apply(null, params);
  }) as any;
}
