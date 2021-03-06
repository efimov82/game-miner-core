import { v4 as uuidv4 } from 'uuid';

import { ICell } from 'src/events/events.types';
import { Field } from './Field';
import { DifficultyLevel, GameSettings, GameState } from './game.types';

export class Game {
  private id: string;
  private countMines: number;
  private field: Field;
  private state: GameState;

  constructor(settings: GameSettings) {
    this.id = uuidv4();
    this.countMines = this.getCountMinesForLevel(settings);
    this.field = new Field(settings.rows, settings.cols, this.countMines);
    this.state = GameState.open;
  }

  public getId(): string {
    return this.id;
  }

  public getCountMines(): number {
    return this.countMines;
  }

  public getState(): GameState {
    return this.state;
  }

  public setField(field: Field): void {
    this.field = field;
  }

  public openCell(cell: ICell): ICell[] {
    const [openedCell, fieldUpdate] = this.field.openCell(cell);

    if (openedCell.isMined()) {
      this.state = GameState.userLose;
    } else if (this.field.isAllMinesDetected()) {
      this.state = GameState.userWin;
    }

    return [...fieldUpdate.values()];
  }

  print(): void {
    this.field.print();
  }

  public markCell(cell: ICell): ICell {
    const res = this.field.markCell(cell);

    if (this.field.isAllMinesDetected()) {
      this.state = GameState.userWin;
    }

    return res;
  }

  getCountMinesForLevel(settings: GameSettings): number {
    const cellsCount = settings.cols * settings.rows;
    let divider: number;

    switch (settings.difficultyLevel) {
      case DifficultyLevel.low:
        divider = 15;
        break;
      case DifficultyLevel.medium:
        divider = 10;
        break;
      case DifficultyLevel.high:
        divider = 5;
        break;
      case DifficultyLevel.hardcore:
        divider = 4;
        break;
      default:
        throw new Error('Wrong DifficultyLevel value');
    }

    return Math.round(cellsCount / divider);
  }
}
