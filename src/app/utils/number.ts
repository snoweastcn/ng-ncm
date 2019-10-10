export function limitNumberInRange(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getPercent(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 100;
}
