export interface GameSettings {
  rows: number;
  cols: number;
  difficultyLevel: DifficultyLevel;
}

export enum DifficultyLevel {
  low = 'low',
  medium = 'medium',
  high = 'high',
  hardcore = 'hardcore',
}

export enum GameState {
  empty = 'empty',
  open = 'open',
  userWin = 'win',
  userLose = 'lose',
}
