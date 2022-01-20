import { Cell } from './Cell';

export function createEmptyField(rows: number, cols: number): Cell[][] {
  return Array.from(Array(rows).keys(), (x) => []).map((_, rowIndex) => {
    const cellsData = Array.from(
      Array(cols).keys(),
      (_, cellIndex) => new Cell(rowIndex, cellIndex),
    );
    return [...cellsData];
  });
}
