import { CellTypeEnum } from './Cell';
import { Field } from './Field';
import { Game } from './Game';
import { DifficultyLevel, GameState } from './game.types';
import { createEmptyField } from './utils.functions';

describe('Game', () => {
  let game: Game;

  describe('Game', () => {
    it('should create"', () => {
      game = new Game({
        rows: 5,
        cols: 5,
        difficultyLevel: DifficultyLevel.low,
      });
      expect(game.getId()).toBeDefined();
      expect(game.getState()).toBe(GameState.open);
    });

    it('game status eq userLose on mine opened', () => {
      const rows = 3;
      const cols = 3;
      const mines = 2;
      const dataField = createEmptyField(rows, cols);
      const field = new Field(rows, cols, mines);

      dataField[1][1].setType(CellTypeEnum.mine);

      field.setField(dataField);
      game = new Game({
        rows,
        cols,
        difficultyLevel: DifficultyLevel.low,
      });

      game.setField(field);
      game.openCell({ row: 1, col: 1 });

      expect(game.getState()).toBe(GameState.userLose);
    });

    it('game status eq userWin for all cell opened', () => {
      const rows = 3;
      const cols = 3;
      const mines = 2;
      const dataField = createEmptyField(rows, cols);
      const field = new Field(rows, cols, mines);

      dataField[1][2].setType(CellTypeEnum.mine);
      dataField[2][2].setType(CellTypeEnum.mine);
      field.setField(dataField);

      game = new Game({
        rows,
        cols,
        difficultyLevel: DifficultyLevel.low,
      });

      game.setField(field);
      game.openCell({ row: 0, col: 0 });
      game.openCell({ row: 0, col: 2 });

      expect(game.getState()).toBe(GameState.userWin);
    });

    it('game status eq userWin for all marked mines', () => {
      const rows = 3;
      const cols = 3;
      const mines = 2;
      const dataField = createEmptyField(rows, cols);
      const field = new Field(rows, cols, mines);

      dataField[1][2].setType(CellTypeEnum.mine);
      dataField[2][2].setType(CellTypeEnum.mine);
      field.setField(dataField);

      game = new Game({
        rows,
        cols,
        difficultyLevel: DifficultyLevel.low,
      });

      game.setField(field);
      game.markCell({ row: 1, col: 2 });
      game.markCell({ row: 2, col: 2 });

      expect(game.getState()).toBe(GameState.userWin);
    });

    it('game status eq userWin for part mines marked and other cells opened', () => {
      const rows = 3;
      const cols = 3;
      const mines = 2;
      const dataField = createEmptyField(rows, cols);
      const field = new Field(rows, cols, mines);

      dataField[1][2].setType(CellTypeEnum.mine);
      dataField[2][2].setType(CellTypeEnum.mine);
      field.setField(dataField);

      game = new Game({
        rows,
        cols,
        difficultyLevel: DifficultyLevel.low,
      });

      game.setField(field);

      game.markCell({ row: 1, col: 2 });
      game.openCell({ row: 2, col: 0 });
      game.openCell({ row: 0, col: 2 });

      expect(game.getState()).toBe(GameState.userWin);
    });
  });
});
