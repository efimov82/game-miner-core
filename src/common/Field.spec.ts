import { ICell } from 'src/events/events.types';
import { Cell, CellTypeEnum } from './Cell';
import { Field } from './Field';

describe('Field', () => {
  let field: Field;

  describe('Field', () => {
    it('should create"', () => {
      field = new Field(5, 6, 10);

      expect(field.getRows()).toBe(5);
      expect(field.getCols()).toBe(6);
      expect(field.getMines().size).toBe(10);
    });

    it('should open all cell for empty field"', () => {
      const rows = 3;
      const cols = 3;
      const mines = 2;
      field = new Field(rows, cols, mines);
      const dataField = createEmptyField(rows, cols);

      field.setField(dataField);

      const [cell, fieldUpdates] = field.openCell({ row: 0, col: 0 });

      expect(fieldUpdates.size).toBe(9);
      expect(cell.isOpen()).toBe(true);
    });

    it('should return mine on mined cell click', () => {
      const rows = 3;
      const cols = 3;
      const mines = 2;
      field = new Field(rows, cols, mines);
      const dataField = createEmptyField(rows, cols);
      dataField[1][1].setType(CellTypeEnum.mine);

      field.setField(dataField);

      const [cell, fieldUpdates] = field.openCell({ row: 1, col: 1 });

      expect(fieldUpdates.size).toBe(1);

      const expected = new Map<string, ICell>();
      expected.set('1_1', { row: 1, col: 1, countMines: 'x' });
      expect(fieldUpdates).toStrictEqual(expected);
    });
  });
});

function createEmptyField(rows: number, cols: number): Cell[][] {
  return Array.from(Array(rows).keys(), (x) => []).map((_, rowIndex) => {
    const cellsData = Array.from(
      Array(cols).keys(),
      (_, cellIndex) => new Cell(rowIndex, cellIndex),
    );
    return [...cellsData];
  });
}
