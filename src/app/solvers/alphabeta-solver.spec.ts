import { AlphabetaSolver } from "./alphabeta-solver";
import { FREE_CELL, ROWS, COLUMNS, Player, MIN_INF, MAX_INF } from "../models";
import { GridUtil } from "../util/grid.util";

const gridUtil = new GridUtil();
const solver = new AlphabetaSolver();
let grid: string[] = [];

beforeAll(() => {
  solver.setGridUtil(gridUtil);
  solver.setMaximizePlayer(Player.COMPUTER);
  solver.setMinimizePlayer(Player.PLAYER1);
});

describe("AlphabetaSolver", () => {
  describe("alphabeta returns best score in maximization", () => {
    beforeEach(() => {
      grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
    });

    it("alphabeta returns 0 score in a draw game", () => {
      [
        0,
        2,
        3,
        5,
        6,
        10,
        11,
        15,
        19,
        20,
        22,
        25,
        27,
        28,
        29,
        30,
        32,
        33,
        37,
        38,
        41
      ].forEach(i => (grid[i] = Player.PLAYER1));
      [
        1,
        4,
        7,
        8,
        9,
        12,
        13,
        14,
        16,
        17,
        18,
        21,
        23,
        24,
        26,
        31,
        34,
        36,
        39,
        40,
        35
      ].forEach(i => (grid[i] = Player.COMPUTER));
      gridUtil.setGrid(grid);
      const score = solver.alphabeta(
        { row: 6, col: 0 },
        1,
        MIN_INF,
        MAX_INF,
        true
      );
      expect(score).toBe(0);
    });

    it("alphabeta returns winning score for a winning move", () => {
      [2, 3, 4, 9].forEach(i => (grid[i] = Player.PLAYER1));
      [1, 8, 15].forEach(i => (grid[i] = Player.COMPUTER));
      gridUtil.setGrid(grid);
      const score = solver.alphabeta(
        { row: 3, col: 1 },
        1,
        MIN_INF,
        MAX_INF,
        true
      );
      expect(score).toBe(18);
    });

    it("alphabeta returns score after depth = 1 is reached", () => {
      grid[2] = Player.PLAYER1;
      gridUtil.setGrid(grid);
      const score = solver.alphabeta(
        { row: 0, col: 0 },
        1,
        MIN_INF,
        MAX_INF,
        true
      );
      expect(score).toBe(8);
    });

    it("alphabeta returns score after depth = 2 is reached and move is (0,0)", () => {
      grid[2] = Player.PLAYER1;
      gridUtil.setGrid(grid);
      const score = solver.alphabeta(
        { row: 0, col: 0 },
        2,
        MIN_INF,
        MAX_INF,
        true
      );
      expect(score).toBe(4);
    });

    it("alphabeta returns score after depth = 2 is reached and move is (0,1)", () => {
      grid[2] = Player.PLAYER1;
      gridUtil.setGrid(grid);
      const score = solver.alphabeta(
        { row: 0, col: 1 },
        2,
        MIN_INF,
        MAX_INF,
        true
      );
      expect(score).toBe(3);
    });

    it("alphabeta returns score after depth = 2 is reached and move is (0,2)", () => {
      grid[2] = Player.PLAYER1;
      gridUtil.setGrid(grid);
      const score = solver.alphabeta(
        { row: 0, col: 2 },
        2,
        MIN_INF,
        MAX_INF,
        true
      );
      expect(score).toBe(3);
    });

    it("alphabeta returns score after depth = 2 is reached and move is (0,3)", () => {
      grid[2] = Player.PLAYER1;
      gridUtil.setGrid(grid);
      const score = solver.alphabeta(
        { row: 0, col: 3 },
        2,
        MIN_INF,
        MAX_INF,
        true
      );
      expect(score).toBe(3);
    });

    it("alphabeta returns score after depth = 2 is reached and move is (0,4)", () => {
      grid[2] = Player.PLAYER1;
      gridUtil.setGrid(grid);
      const score = solver.alphabeta(
        { row: 0, col: 4 },
        2,
        MIN_INF,
        MAX_INF,
        true
      );
      expect(score).toBe(3);
    });

    it("alphabeta returns score after depth = 2 is reached and move is (0,5)", () => {
      grid[2] = Player.PLAYER1;
      gridUtil.setGrid(grid);
      const score = solver.alphabeta(
        { row: 0, col: 5 },
        2,
        MIN_INF,
        MAX_INF,
        true
      );
      expect(score).toBe(3);
    });

    it("alphabeta returns score after depth = 2 is reached and move is (0,6)", () => {
      grid[2] = Player.PLAYER1;
      gridUtil.setGrid(grid);
      const score = solver.alphabeta(
        { row: 0, col: 6 },
        2,
        MIN_INF,
        MAX_INF,
        true
      );
      expect(score).toBe(4);
    });
  });

  describe("bestScore returns the best score minmax", () => {
    beforeEach(() => {
      grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
    });

    it("bestScore returns the best score among all game trees", () => {
      grid[2] = Player.PLAYER1;
      gridUtil.setGrid(grid);
      const score = solver.bestScore(grid);
      expect(score).toBe(4);
    });

    it("bestMove returns the best score among all game trees", () => {
      grid[2] = Player.PLAYER1;
      gridUtil.setGrid(grid);
      const { row, col } = solver.bestMove(grid);
      expect(row).toBe(0);
      expect(col).toBe(0);
    });
  });
});
