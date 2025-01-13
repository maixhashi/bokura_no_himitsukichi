export const mapData: number[][] = [
  Array(50).fill(0),
  Array(50).fill(1),
  ...Array.from({ length: 100 }, () => Array(50).fill(2)),
];
