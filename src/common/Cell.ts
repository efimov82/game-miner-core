export enum CellTypeEnum {
  empty = 'empty',
  mine = 'mine',
}

export class Cell {
  private _isOpen = false;
  private _isMarked = false;
  private minesAround = 0;
  private debugInfo?: string;

  constructor(
    private row: number,
    private col: number,
    private type: CellTypeEnum = CellTypeEnum.empty,
  ) {}

  public getRow(): number {
    return this.row;
  }

  public getCol(): number {
    return this.col;
  }

  public getId(): string {
    return `${this.row}_${this.col}`;
  }

  public getType(): CellTypeEnum {
    return this.type;
  }

  public isOpen(): boolean {
    return this._isOpen;
  }

  public isEmpty(): boolean {
    return this.type === CellTypeEnum.empty;
  }

  public isMarked(): boolean {
    return this._isMarked;
  }

  public isMined(): boolean {
    return this.type === CellTypeEnum.mine;
  }

  public open(): boolean {
    if (this._isMarked) return false;

    this._isOpen = true;
    return true;
  }

  public getMinesAround(): number {
    return this.minesAround;
  }

  public setMinesAround(value: number): void {
    this.minesAround = value;
  }

  public mark(): boolean {
    return this.setMarked(!this._isMarked);
  }

  public setMarked(value: boolean): boolean {
    if (this._isOpen) return false;

    this._isMarked = value;
    return value;
  }

  public setType(type: CellTypeEnum) {
    this.type = type;
  }
}
