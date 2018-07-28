import { MinimaxSolver, BestMoveInfo } from "./minimax-solver";
import { FREE_CELL, ROWS, COLUMNS, Player } from "../models";

describe("MinimaxSolver", () => {
  let solver = new MinimaxSolver();
  let grid: string[] = [];

  describe ('A draw game should return correct score and position', () => {
    beforeEach(() => {
      grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
    });

    it('return 0 score and null position', () => {
      [0, 2, 3, 5, 6, 10, 11, 15, 19, 20, 22, 25, 27, 28, 29, 30, 32, 33, 37, 38, 41].forEach((i) => grid[i] = Player.PLAYER1);
      [1, 4, 7, 8, 9, 12, 13, 14, 16, 17, 18, 21, 23, 24, 26, 31, 34, 36, 39, 40, 35].forEach((i) => grid[i] = Player.PLAYER2);
      const score = solver.bestScore({ grid, player: Player.PLAYER1, oppositePlayer: Player.PLAYER2 });
      const pos = solver.bestMove({ grid, player: Player.PLAYER1, oppositePlayer: Player.PLAYER2 });
      expect(score).toBe(0);
      expect(pos.row).toBeNull();
      expect(pos.col).toBeNull();
    });

    it('return 0 score and null position', () => {
      [2, 10, 12, 18].forEach((i) => grid[i] = Player.PLAYER1);
      [3, 4, 5, 11, 19].forEach((i) => grid[i] = Player.PLAYER2);
      const score = solver.bestScore({ grid, player: Player.PLAYER1, oppositePlayer: Player.PLAYER2 });
      const pos = solver.bestMove({ grid, player: Player.PLAYER1, oppositePlayer: Player.PLAYER2 });
      expect(score).toBe(17);
      expect(pos.row).toBe(3);
      expect(pos.col).toBe(5);
    });
  });
});
