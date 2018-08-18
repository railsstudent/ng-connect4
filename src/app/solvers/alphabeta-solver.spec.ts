import { AlphabetaSolver } from "./alphabeta-solver";
import { FREE_CELL, ROWS, COLUMNS, Player, INF } from "../models";
import { Board } from "../util/board";

let board = new Board();
const solver = new AlphabetaSolver();
let grid: string[] = [];

beforeAll(() => {
  solver.setMaximizePlayer(Player.COMPUTER);
  solver.setMinimizePlayer(Player.PLAYER1);
});

xdescribe("AlphabetaSolver", () => {
  describe("alphabeta returns best score in maximization", () => {
    beforeEach(() => {
      board = new Board();
      grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
    });

    it("alphabeta returns 0 score in a draw game", () => {
      [0, 2, 3, 5, 6, 10, 11, 15, 19, 20, 22, 25, 27, 28, 29, 30, 32, 33, 37, 38, 41].forEach(
        i => (grid[i] = Player.PLAYER1)
      );
      [1, 4, 7, 8, 9, 12, 13, 14, 16, 17, 18, 21, 23, 24, 26, 31, 34, 36, 39, 40, 35].forEach(
        i => (grid[i] = Player.COMPUTER)
      );
      board.clone(grid);
      const score = solver.alphabeta({ row: 6, col: 0 }, 1, -INF, INF, true);
      expect(score).toBe(0);
    });

    it("alphabeta returns winning score for a winning move", () => {
      [2, 3, 4, 9].forEach(i => (grid[i] = Player.PLAYER1));
      [1, 8, 15].forEach(i => (grid[i] = Player.COMPUTER));
      board.clone(grid);
      const score = solver.alphabeta({ row: 3, col: 1 }, 1, -INF, INF, true);
      expect(score).toBe(10000);
    });

    it("alphabeta returns score after depth = 1 is reached", () => {
      grid[2] = Player.PLAYER1;
      board.clone(grid);
      const score = solver.alphabeta({ row: 0, col: 0 }, 1, -INF, INF, true);
      expect(score).toBe(8);
    });

    it("alphabeta returns score after depth = 2 is reached and move is (0,0)", () => {
      grid[2] = Player.PLAYER1;
      board.clone(grid);
      const score = solver.alphabeta({ row: 0, col: 0 }, 2, -INF, INF, true);
      expect(score).toBe(4);
    });

    it("alphabeta returns score after depth = 2 is reached and move is (0,1)", () => {
      grid[2] = Player.PLAYER1;
      board.clone(grid);
      const score = solver.alphabeta({ row: 0, col: 1 }, 2, -INF, INF, true);
      expect(score).toBe(3);
    });

    it("alphabeta returns score after depth = 2 is reached and move is (0,2)", () => {
      grid[2] = Player.PLAYER1;
      board.clone(grid);
      const score = solver.alphabeta({ row: 0, col: 2 }, 2, -INF, INF, true);
      expect(score).toBe(3);
    });

    it("alphabeta returns score after depth = 2 is reached and move is (0,3)", () => {
      grid[2] = Player.PLAYER1;
      board.clone(grid);
      const score = solver.alphabeta({ row: 0, col: 3 }, 2, -INF, INF, true);
      expect(score).toBe(3);
    });

    it("alphabeta returns score after depth = 2 is reached and move is (0,4)", () => {
      grid[2] = Player.PLAYER1;
      board.clone(grid);
      const score = solver.alphabeta({ row: 0, col: 4 }, 2, -INF, INF, true);
      expect(score).toBe(3);
    });

    it("alphabeta returns score after depth = 2 is reached and move is (0,5)", () => {
      grid[2] = Player.PLAYER1;
      board.clone(grid);
      const score = solver.alphabeta({ row: 0, col: 5 }, 2, -INF, INF, true);
      expect(score).toBe(3);
    });

    it("alphabeta returns score after depth = 2 is reached and move is (0,6)", () => {
      grid[2] = Player.PLAYER1;
      board.clone(grid);
      const score = solver.alphabeta({ row: 0, col: 6 }, 2, -INF, INF, true);
      expect(score).toBe(4);
    });
  });

  describe("bestScore returns the best score minmax", () => {
    beforeEach(() => {
      board = new Board();
      grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
    });

    it("bestMove returns the best score among all game trees", () => {
      grid[2] = Player.PLAYER1;
      board.clone(grid);
      const col = solver.bestMove(board);
      expect(col).toBe(0);
    });
  });
});
