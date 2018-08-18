import { MinimaxSolver } from "./minimax-solver";
import { Player, ROWS, COLUMNS, FREE_CELL } from "../models";
import { Board } from "../util/board";

describe("MinimaxSolver", () => {
  let board = new Board();
  const solver = new MinimaxSolver();

  beforeAll(() => {
    solver.setMaximizePlayer(Player.COMPUTER);
    solver.setMinimizePlayer(Player.PLAYER1);
  });

  describe("bestMove returns the best minimax move", () => {
    beforeEach(() => {
      board = new Board();
    });

    it("bestMove returns the best move that prevent human from winning", () => {
      board.play(2, Player.PLAYER1);
      board.play(3, Player.COMPUTER);
      board.play(2, Player.PLAYER1);
      board.play(3, Player.COMPUTER);
      board.play(2, Player.PLAYER1);

      const col = solver.bestMove(board);
      expect(col).toBe(2);
    });

    it("bestMove returns the best move that prevent human from winning 2", () => {
      board.play(3, Player.PLAYER1);
      board.play(3, Player.COMPUTER);
      board.play(3, Player.PLAYER1);
      board.play(4, Player.COMPUTER);
      board.play(4, Player.PLAYER1);
      board.play(4, Player.COMPUTER);
      board.play(1, Player.PLAYER1);
      board.play(2, Player.COMPUTER);
      board.play(2, Player.PLAYER1);

      const col = solver.bestMove(board);
      expect(col).toBe(4);
    });

    it("bestMove returns the best move that let computer win", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }

      [0, 1, 3, 5, 10, 11, 18, 19, 20, 26].forEach(i => (grid[i] = Player.PLAYER1));
      [2, 4, 6, 9, 12, 13, 17, 25, 27].forEach(i => (grid[i] = Player.COMPUTER));
      board.clone(grid);

      const col = solver.bestMove(board);
      expect(col).toBe(5);
    });

    it("bestMove returns the best move that maximize the minimum value", () => {
      board.play(0, Player.PLAYER1);
      board.play(0, Player.COMPUTER);
      board.play(1, Player.PLAYER1);
      board.play(1, Player.COMPUTER);
      board.play(2, Player.PLAYER1);
      board.play(3, Player.COMPUTER);
      board.play(2, Player.PLAYER1);
      board.play(2, Player.COMPUTER);
      board.play(4, Player.PLAYER1);

      const col = solver.bestMove(board);
      expect(col).toBe(0);
    });
  });
});
