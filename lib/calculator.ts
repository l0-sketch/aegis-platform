import { z } from 'zod';

const numberSchema = z.number();

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
  convertLength: (value: number, from: string, to: string) => {
    const factors = {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.344
    } as Record<string, number>;
    const normalizedFrom = from.toLowerCase();
    const normalizedTo = to.toLowerCase();
    if (!factors[normalizedFrom] || !factors[normalizedTo]) {
      throw new Error('Unsupported unit in conversion.');
    }
    return (value * factors[normalizedFrom]) / factors[normalizedTo];
  },
  mean: (values: number[]) => {
    const parsed = values.map((v) => numberSchema.parse(v));
    return parsed.reduce((sum, v) => sum + v, 0) / parsed.length;
  },
  standardDeviation: (values: number[]) => {
    const parsed = values.map((v) => numberSchema.parse(v));
    const avg = this.mean(parsed);
    const variance = parsed.reduce((sum, v) => sum + (v - avg) ** 2, 0) / parsed.length;
    return Math.sqrt(variance);
  }
};
