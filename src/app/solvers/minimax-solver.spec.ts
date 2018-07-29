import { MinimaxSolver, BestMoveInfo } from "./minimax-solver";
import { FREE_CELL, ROWS, COLUMNS, Player } from "../models";
import { GridUtil } from "../util/grid.util";

describe("MinimaxSolver", () => {
  const solver = new MinimaxSolver();
  let grid: string[] = [];

  describe("Calculate heuristic evaluation", () => {
    beforeEach(() => {
      grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
    });

    it("correct evaluation value returned if the piece reaches depth", () => {
      grid[2] = Player.PLAYER1;
      grid[0] = Player.PLAYER2;
      grid[7] = Player.PLAYER1;
      let gridUtil = new GridUtil();
      gridUtil.setGrid(grid);
      solver.setGridUtil(gridUtil);
      const score = solver.heuristicEvaluation(Player.PLAYER2, {
        row: 2,
        col: 0
      });
      expect(score).toBe(5);
    });

    it("correct evaluation value returned if the piece reaches depth 2", () => {
      grid[2] = Player.PLAYER1;
      grid[0] = Player.PLAYER2;
      grid[7] = Player.PLAYER1;
      let gridUtil = new GridUtil();
      gridUtil.setGrid(grid);
      solver.setGridUtil(gridUtil);
      const score = solver.heuristicEvaluation(Player.PLAYER2, {
        row: 1,
        col: 2
      });
      expect(score).toBe(8);
    });

    it("correct evaluation value returned if the piece is a winning piece", () => {
      grid[0] = Player.PLAYER1;
      grid[2] = Player.PLAYER2;
      grid[1] = Player.PLAYER1;
      grid[9] = Player.PLAYER2;
      grid[8] = Player.PLAYER1;
      grid[16] = Player.PLAYER2;
      grid[15] = Player.PLAYER1;
      let gridUtil = new GridUtil();
      gridUtil.setGrid(grid);
      solver.setGridUtil(gridUtil);
      const score = solver.heuristicEvaluation(Player.PLAYER2, {
        row: 3,
        col: 2
      });
      expect(score).toBe(18);
    });
  });

  describe("minimax returns best score in maximization", () => {
    beforeEach(() => {
      grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
    });

    it("minimax returns 0 score in a draw game", () => {
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
      let gridUtil = new GridUtil();
      gridUtil.setGrid(grid);
      solver.setGridUtil(gridUtil);
      const score = solver.minimax(
        gridUtil.gridCopy,
        { row: 6, col: 0 },
        Player.COMPUTER,
        Player.PLAYER1,
        1,
        true
      );
      expect(score).toBe(0);
    });

    it("minimax returns winning score for a winning move", () => {
      [2, 3, 4, 9].forEach(i => (grid[i] = Player.PLAYER1));
      [1, 8, 15].forEach(i => (grid[i] = Player.COMPUTER));
      let gridUtil = new GridUtil();
      gridUtil.setGrid(grid);
      solver.setGridUtil(gridUtil);
      const score = solver.minimax(
        gridUtil.gridCopy,
        { row: 3, col: 1 },
        Player.COMPUTER,
        Player.PLAYER1,
        1,
        true
      );
      expect(score).toBe(18);
    });

    it("minimax returns score after depth = 1 is reached", () => {
      grid[2] = Player.PLAYER1;
      let gridUtil = new GridUtil();
      gridUtil.setGrid(grid);
      solver.setGridUtil(gridUtil);
      const score = solver.minimax(
        gridUtil.gridCopy,
        { row: 0, col: 0 },
        Player.COMPUTER,
        Player.PLAYER1,
        1,
        true
      );
      expect(score).toBe(8);
    });

    it("minimax returns score after depth = 2 is reached and move is (0,0)", () => {
      grid[2] = Player.PLAYER1;
      let gridUtil = new GridUtil();
      gridUtil.setGrid(grid);
      solver.setGridUtil(gridUtil);
      const score = solver.minimax(
        gridUtil.gridCopy,
        { row: 0, col: 0 },
        Player.COMPUTER,
        Player.PLAYER1,
        2,
        true
      );
      expect(score).toBe(4);
    });
  });

  it("minimax returns score after depth = 2 is reached and move is (0,1)", () => {
    grid[2] = Player.PLAYER1;
    let gridUtil = new GridUtil();
    gridUtil.setGrid(grid);
    solver.setGridUtil(gridUtil);
    const score = solver.minimax(
      gridUtil.gridCopy,
      { row: 0, col: 1 },
      Player.COMPUTER,
      Player.PLAYER1,
      2,
      true
    );
    expect(score).toBe(3);
  });

  it("minimax returns score after depth = 2 is reached and move is (0,2)", () => {
    grid[2] = Player.PLAYER1;
    let gridUtil = new GridUtil();
    gridUtil.setGrid(grid);
    solver.setGridUtil(gridUtil);
    const score = solver.minimax(
      gridUtil.gridCopy,
      { row: 0, col: 2 },
      Player.COMPUTER,
      Player.PLAYER1,
      2,
      true
    );
    expect(score).toBe(3);
  });

  it("minimax returns score after depth = 2 is reached and move is (0,3)", () => {
    grid[2] = Player.PLAYER1;
    let gridUtil = new GridUtil();
    gridUtil.setGrid(grid);
    solver.setGridUtil(gridUtil);
    const score = solver.minimax(
      gridUtil.gridCopy,
      { row: 0, col: 3 },
      Player.COMPUTER,
      Player.PLAYER1,
      2,
      true
    );
    expect(score).toBe(3);
  });

  it("minimax returns score after depth = 2 is reached and move is (0,4)", () => {
    grid[2] = Player.PLAYER1;
    let gridUtil = new GridUtil();
    gridUtil.setGrid(grid);
    solver.setGridUtil(gridUtil);
    const score = solver.minimax(
      gridUtil.gridCopy,
      { row: 0, col: 4 },
      Player.COMPUTER,
      Player.PLAYER1,
      2,
      true
    );
    expect(score).toBe(3);
  });

  it("minimax returns score after depth = 2 is reached and move is (0,5)", () => {
    grid[2] = Player.PLAYER1;
    let gridUtil = new GridUtil();
    gridUtil.setGrid(grid);
    solver.setGridUtil(gridUtil);
    const score = solver.minimax(
      gridUtil.gridCopy,
      { row: 0, col: 5 },
      Player.COMPUTER,
      Player.PLAYER1,
      2,
      true
    );
    expect(score).toBe(3);
  });

  it("minimax returns score after depth = 2 is reached and move is (0,6)", () => {
    grid[2] = Player.PLAYER1;
    let gridUtil = new GridUtil();
    gridUtil.setGrid(grid);
    solver.setGridUtil(gridUtil);
    const score = solver.minimax(
      gridUtil.gridCopy,
      { row: 0, col: 6 },
      Player.COMPUTER,
      Player.PLAYER1,
      2,
      true
    );
    expect(score).toBe(4);
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
      let gridUtil = new GridUtil();
      gridUtil.setGrid(grid);
      solver.setGridUtil(gridUtil);
      const score = solver.bestScore({
        grid,
        player: Player.COMPUTER,
        oppositePlayer: Player.PLAYER1
      });
      expect(score).toBe(4);
    });

    it("bestMove returns the best score among all game trees", () => {
      grid[2] = Player.PLAYER1;
      let gridUtil = new GridUtil();
      gridUtil.setGrid(grid);
      solver.setGridUtil(gridUtil);
      const { row, col } = solver.bestMove({
        grid,
        player: Player.COMPUTER,
        oppositePlayer: Player.PLAYER1
      });
      expect(row).toBe(0);
      expect(col).toBe(0);
    });
  });
});
