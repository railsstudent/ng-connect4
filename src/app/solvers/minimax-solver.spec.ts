import { MinimaxSolver } from "./minimax-solver";
import { Player } from "../models";
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
      expect(col).toBe(6);
    });
  });
});
