export function limitNumberInRange(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getPercent(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 100;
}

// 取[min, max]之间的随机数
export function getRandomInt(range: [number, number]): number {
  return Math.floor(Math.random() * (range[1] - range[0] + 1) + range[0]);
}
