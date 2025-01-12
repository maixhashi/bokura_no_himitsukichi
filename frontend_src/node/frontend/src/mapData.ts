// mapData.ts
export const mapData: number[][] = [
  Array(50).fill(0),
  Array(50).fill(1),
  ...Array(100).fill(Array(50).fill(2)),
];
