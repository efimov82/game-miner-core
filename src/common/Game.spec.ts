import { Game } from './Game';
import { DifficultyLevel, GameState } from './game.types';

describe('Game', () => {
  let game: Game;

  describe('root', () => {
    it('should create"', () => {
      game = new Game({
        rows: 5,
        cols: 5,
        difficultyLevel: DifficultyLevel.low,
      });
      expect(game.getId()).toBeDefined();
      expect(game.getState()).toBe(GameState.open);
    });
  });
});
