export const calculator = {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
  multiply: (a: number, b: number) => a * b,
  divide: (a: number, b: number) => {
    if (b === 0) throw new Error('Division by zero is not allowed.');
    return a / b;
  },
  sqrt: (value: number) => Math.sqrt(value),
  power: (base: number, exponent: number) => Math.pow(base, exponent),
  mean: (values: number[]) => {
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  },
  standardDeviation: (values: number[]) => {
    if (!values.length) return 0;
    const avg = calculator.mean(values);
    const variance = values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
    return Math.sqrt(variance);
  },
  convertLength: (value: number, from: string, to: string) => {
    const factors: Record<string, number> = {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.344,
    } as const;

    const fromUnit = from.toLowerCase();
    const toUnit = to.toLowerCase();

    if (!factors[fromUnit] || !factors[toUnit]) {
      throw new Error('Unsupported length unit for conversion.');
    }

    return (value * factors[fromUnit]) / factors[toUnit];
  },
};
