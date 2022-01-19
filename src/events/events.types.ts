import { GameState } from 'src/common/game.types';

export interface newGameRes {
  id: string;
  gameState: GameState;
  countMines: number;
}

export interface ICell {
  row: number;
  col: number;
  countMines?: number | string;
}

export interface cellClickRes {
  gameState: GameState;
  fieldUpdate: ICell[];
}
