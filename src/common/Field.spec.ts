import { ICell } from 'src/events/events.types';
import { CellTypeEnum } from './Cell';
import { Field } from './Field';
import { createEmptyField } from './utils.functions';

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
      const dataField = createEmptyField(rows, cols);

      field = new Field(rows, cols, mines);
      dataField[1][1].setType(CellTypeEnum.mine);

      field.setField(dataField);

      const [, fieldUpdates] = field.openCell({ row: 1, col: 1 });

      const expected = new Map<string, ICell>();
      expected.set('1_1', { row: 1, col: 1, countMines: 'x' });

      expect(fieldUpdates).toStrictEqual(expected);
    });

    it('should open not mined cells around empty cell', () => {
      //TODO
    });

    it('should open only 1 cell if count mines around > 0', () => {
      const rows = 5;
      const cols = 5;
      const mines = 2;
      const dataField = createEmptyField(rows, cols);

      field = new Field(rows, cols, mines);
      dataField[0][3].setType(CellTypeEnum.mine);
      dataField[3][3].setType(CellTypeEnum.mine);

      field.setField(dataField);

      field.openCell({ row: 0, col: 0 });
      const [, fieldUpdates] = field.openCell({ row: 3, col: 4 });

      const expected = new Map<string, ICell>();
      expected.set('3_4', { row: 3, col: 4, countMines: 1 });

      expect(fieldUpdates).toStrictEqual(expected);
    });

    it('should mark closed cell', () => {
      const rows = 2;
      const cols = 2;
      const mines = 2;

      field = new Field(rows, cols, mines);
      const res = field.markCell({ row: 0, col: 1 });

      expect(res.isMarked).toBeTruthy();
    });

    it('should unmark marked cell', () => {
      const rows = 2;
      const cols = 2;
      const mines = 2;

      field = new Field(rows, cols, mines);

      field.markCell({ row: 0, col: 1 });
      const res = field.markCell({ row: 0, col: 1 });

      expect(res.isMarked).toBeFalsy();
    });
  });
});
