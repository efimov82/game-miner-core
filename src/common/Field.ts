import { ICell } from 'src/events/events.types';
import { Cell, CellTypeEnum } from './Cell';

export class Field {
  private field: Cell[][] = [];
  private mines: Map<string, Cell>;

  constructor(
    private rows: number,
    private cols: number,
    private countMines: number,
  ) {
    this.initField();
    this.generateMines();
    this.calculateNumbers();
  }

  public setField(field: Cell[][]): void {
    this.field = field;
    this.rows = field.length;
    this.cols = field[0].length;
    this.calculateMinesFromFieldData();
    this.calculateNumbers();
  }

  public getRows(): number {
    return this.rows;
  }

  public getCols(): number {
    return this.cols;
  }

  public getMines(): Map<string, Cell> {
    return this.mines;
  }

  public openCell(cell: ICell): [Cell, Map<string, ICell>] {
    const targetCell = this.field[cell.row][cell.col];
    let fieldUpdate = new Map<string, ICell>();

    targetCell.open();
    if (targetCell.isMined()) {
      fieldUpdate.set(targetCell.getId(), {
        row: targetCell.getRow(),
        col: targetCell.getCol(),
        countMines: 'x',
      });
    } else if (targetCell.getMinesAround() !== 0) {
      fieldUpdate.set(targetCell.getId(), {
        row: targetCell.getRow(),
        col: targetCell.getCol(),
        countMines: targetCell.getMinesAround(),
      });
    } else {
      fieldUpdate = this.openEmptyCells(cell.row, cell.col);
    }

    return [targetCell, fieldUpdate];
  }

  public markCell(cell: ICell): ICell {
    cell.isMarked = this.field[cell.row][cell.col].mark();

    return cell;
  }

  /**
   * Check all mines marked or all not mined cells opened
   */
  public isAllMinesDetected(): boolean {
    let allMinesMarked = true;

    this.mines.forEach((cell) => {
      if (!cell.isMarked()) {
        allMinesMarked = false;
      }
    });

    if (allMinesMarked) return true;

    // check closed cells
    const closedCells = this.collectClosedCells();
    if (closedCells.length === this.mines.size) return true;

    return false;
  }

  protected collectClosedCells(): Cell[] {
    const res: Cell[] = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = this.field[row][col];

        if (!cell.isOpen()) {
          res.push(cell);
        }
      }
    }

    return res;
  }

  protected initField(): void {
    this.field = Array.from(Array(this.rows).keys(), (x) => []).map(
      (_, rowIndex) => {
        const cellsData = Array.from(
          Array(this.cols).keys(),
          (_, cellIndex) => new Cell(rowIndex, cellIndex),
        );
        return [...cellsData];
      },
    );
  }

  protected generateMines(): void {
    this.mines = new Map<string, Cell>();

    let minesForSet = this.countMines;
    while (minesForSet > 0) {
      const xPos = Math.floor(Math.random() * this.rows);
      const yPos = Math.floor(Math.random() * this.cols);

      if (this.field[xPos][yPos].isEmpty()) {
        this.field[xPos][yPos].setType(CellTypeEnum.mine);
        const cell = this.field[xPos][yPos];
        this.mines.set(cell.getId(), cell);
        minesForSet--;
      }
    }
  }

  protected calculateMinesFromFieldData(): void {
    this.mines = new Map<string, Cell>();

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = this.field[row][col];
        if (cell.isMined()) {
          this.mines.set(cell.getId(), cell);
        }
      }
    }
  }

  print() {
    for (let i = 0; i < this.rows; i++) {
      let line = '';
      for (let j = 0; j < this.cols; j++) {
        const cell = this.field[i][j];

        if (cell.isOpen()) {
          line += `-${cell.getMinesAround()}`;
        } else if (cell.isMarked()) {
          line += '-F';
          line += cell.isMined() ? 'M' : '';
        } else if (cell.isMined()) {
          line += '-M';
        } else {
          line += '-x';
        }
      }

      console.log(line);
    }
  }

  protected calculateNumbers(): void {
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      for (let cellIndex = 0; cellIndex < this.cols; cellIndex++) {
        if (!this.field[rowIndex][cellIndex].isEmpty()) {
          continue;
        }

        const startRowIndex = rowIndex - 1 >= 0 ? rowIndex - 1 : 0;
        const startCellIndex = cellIndex - 1 >= 0 ? cellIndex - 1 : 0;
        const endRowIndex =
          rowIndex + 1 < this.rows ? rowIndex + 1 : this.rows - 1;
        const endCellIndex =
          cellIndex + 1 < this.cols ? cellIndex + 1 : this.cols - 1;

        let minesAround = 0;
        for (let y = startRowIndex; y <= endRowIndex; y += 1) {
          for (let x = startCellIndex; x <= endCellIndex; x += 1) {
            if (!this.field[y][x].isEmpty()) {
              minesAround += 1;
            }
          }
        }

        this.field[rowIndex][cellIndex].setMinesAround(minesAround);
      }
    }
  }

  protected openEmptyCells(
    rowIndex: number,
    cellIndex: number,
  ): Map<string, ICell> {
    const res: Map<string, ICell> = new Map();
    this.field[rowIndex][cellIndex].open();
    const targetCell = this.field[rowIndex][cellIndex];

    res.set(targetCell.getId(), {
      row: rowIndex,
      col: cellIndex,
      countMines: targetCell.getMinesAround(),
    });

    this.collectCellsAround(rowIndex, cellIndex).forEach((cell) => {
      if (cell.getMinesAround() === 0) {
        const cells = this.openEmptyCells(cell.getRow(), cell.getCol());
        cells.forEach((cell) => {
          res.set(`${cell.row}_${cell.col}`, cell);
        });
      }

      this.field[cell.getRow()][cell.getCol()].open();
      res.set(cell.getId(), {
        row: cell.getRow(),
        col: cell.getCol(),
        countMines: cell.getMinesAround(),
      });
    });

    return res;
  }

  protected collectCellsAround(rowIndex: number, cellIndex: number): Set<Cell> {
    const result = new Set<Cell>();

    const startRowIndex = rowIndex - 1 > 0 ? rowIndex - 1 : 0;
    const endRowIndex =
      rowIndex + 1 < this.rows - 1 ? rowIndex + 1 : this.rows - 1;

    const startCellIndex = cellIndex - 1 > 0 ? cellIndex - 1 : 0;
    const endCellIndex =
      cellIndex + 1 < this.cols - 1 ? cellIndex + 1 : this.cols - 1;

    for (let rIndex = startRowIndex; rIndex <= endRowIndex; rIndex++) {
      for (let cIndex = startCellIndex; cIndex <= endCellIndex; cIndex++) {
        if (
          !this.field[rIndex][cIndex].isOpen() &&
          !this.field[rIndex][cIndex].isMarked()
        ) {
          result.add(this.field[rIndex][cIndex]);
        }
      }
    }

    return result;
  }
}
