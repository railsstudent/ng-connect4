import { Board } from "./board";
import { ROWS, COLUMNS, FREE_CELL, Player, Direction } from "../models";

describe("Board", () => {
  let board: Board;

  describe("canPlay returns true for all columns in a new grid", () => {
    beforeAll(() => {
      board = new Board();
    });

    it("all columns can play when grid is empty", () => {
      for (let i = 0; i < COLUMNS; i++) {
        expect(board.canPlay(i)).toBe(true);
      }
    });

    it("all columns have height 0", () => {
      for (let i = 0; i < COLUMNS; i++) {
        expect(board.height[i]).toBe(0);
      }
    });

    it("zero move is made", () => {
      expect(board.numMoves).toBe(0);
    });
  });

  describe("canPlay returns true if the column has vacant cell", () => {
    beforeEach(() => {
      board = new Board();
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [0, 5, 8, 10, 19, 22, 24, 33, 36].forEach(i => (grid[i] = Player.PLAYER2));
      [1, 3, 4, 12, 15, 17, 26, 29].forEach(i => (grid[i] = Player.PLAYER1));
      board.clone(grid);
    });

    it("columns can play", () => {
      expect(board.canPlay(0)).toBe(true);
      expect(board.canPlay(2)).toBe(true);
      expect(board.canPlay(3)).toBe(true);
      expect(board.canPlay(4)).toBe(true);
      expect(board.canPlay(5)).toBe(true);
      expect(board.canPlay(6)).toBe(true);
    });

    it("column cannot play", () => {
      expect(board.canPlay(1)).toBe(false);
    });

    it("grid has correct number of moves", () => {
      expect(board.canPlay(-1)).toBe(false);
      expect(board.canPlay(COLUMNS)).toBe(false);
    });

    it("columns have the correct height", () => {
      expect(board.height[0]).toBe(1);
      expect(board.height[1]).toBe(6);
      expect(board.height[2]).toBe(0);
      expect(board.height[3]).toBe(4);
      expect(board.height[4]).toBe(1);
      expect(board.height[5]).toBe(5);
      expect(board.height[6]).toBe(0);
    });

    it("grid has correct number of moves", () => {
      expect(board.numMoves).toBe(17);
    });
  });

  describe("play updates column height and grid cell with player's piece", () => {
    beforeEach(() => {
      board = new Board();
    });

    it("Add a single piece to grid", () => {
      board.play(0, Player.PLAYER1);
      expect(board.height[0]).toBe(1);
      expect(board.numMoves).toBe(1);
    });

    it("Add multiple pieces to the same column", () => {
      board.play(6, Player.PLAYER1);
      board.play(6, Player.PLAYER2);
      board.play(6, Player.PLAYER1);
      board.play(6, Player.PLAYER2);
      expect(board.height[6]).toBe(4);
      expect(board.numMoves).toBe(4);
    });

    it("Add multiple pieces to the same column until it is filled entirely", () => {
      board.play(6, Player.PLAYER1);
      board.play(6, Player.PLAYER2);
      board.play(6, Player.PLAYER1);
      board.play(6, Player.PLAYER2);
      board.play(6, Player.PLAYER1);
      board.play(6, Player.PLAYER2);
      board.play(6, Player.PLAYER1);
      expect(board.height[6]).toBe(6);
      expect(board.numMoves).toBe(6);
    });

    it("Add multiple pieces in different columns", () => {
      board.play(6, Player.PLAYER1);
      board.play(6, Player.PLAYER2);

      board.play(3, Player.PLAYER1);
      board.play(4, Player.PLAYER2);
      board.play(3, Player.PLAYER1);
      board.play(4, Player.PLAYER2);
      board.play(4, Player.PLAYER1);
      board.play(1, Player.PLAYER2);

      board.play(5, Player.PLAYER1);
      expect(board.height[0]).toBe(0);
      expect(board.height[1]).toBe(1);
      expect(board.height[2]).toBe(0);
      expect(board.height[3]).toBe(2);
      expect(board.height[4]).toBe(3);
      expect(board.height[5]).toBe(1);
      expect(board.height[6]).toBe(2);

      expect(board.numMoves).toBe(9);
    });
  });

  describe("play updates column height and grid cell with player's piece", () => {
    beforeEach(() => {
      board = new Board();
    });

    it("Add a single piece to grid", () => {
      board.play(0, Player.PLAYER1);
      expect(board.height[0]).toBe(1);
      expect(board.numMoves).toBe(1);
    });

    it("Add multiple pieces to the same column", () => {
      board.play(6, Player.PLAYER1);
      board.play(6, Player.PLAYER2);
      board.play(6, Player.PLAYER1);
      board.play(6, Player.PLAYER2);
      expect(board.height[6]).toBe(4);
      expect(board.numMoves).toBe(4);
    });

    it("Add multiple pieces to the same column until it is filled entirely", () => {
      board.play(6, Player.PLAYER1);
      board.play(6, Player.PLAYER2);
      board.play(6, Player.PLAYER1);
      board.play(6, Player.PLAYER2);
      board.play(6, Player.PLAYER1);
      board.play(6, Player.PLAYER2);
      board.play(6, Player.PLAYER1);
      expect(board.height[6]).toBe(6);
      expect(board.numMoves).toBe(6);
    });

    it("Add multiple pieces in different columns", () => {
      board.play(6, Player.PLAYER1);
      board.play(6, Player.PLAYER2);

      board.play(3, Player.PLAYER1);
      board.play(4, Player.PLAYER2);
      board.play(3, Player.PLAYER1);
      board.play(4, Player.PLAYER2);
      board.play(4, Player.PLAYER1);
      board.play(1, Player.PLAYER2);

      board.play(5, Player.PLAYER1);
      expect(board.height[0]).toBe(0);
      expect(board.height[1]).toBe(1);
      expect(board.height[2]).toBe(0);
      expect(board.height[3]).toBe(2);
      expect(board.height[4]).toBe(3);
      expect(board.height[5]).toBe(1);
      expect(board.height[6]).toBe(2);

      expect(board.numMoves).toBe(9);
    });
  });

  describe("isWinningMove returns true if 4 pieces are connected together vertically", () => {
    beforeEach(() => {
      board = new Board();
    });

    it("return true if it is vertically connected", () => {
      board.play(0, Player.PLAYER1);
      board.play(1, Player.PLAYER2);
      board.play(0, Player.PLAYER1);
      board.play(1, Player.PLAYER2);
      board.play(0, Player.PLAYER1);
      board.play(1, Player.PLAYER2);
      board.play(0, Player.PLAYER1);
      expect(board.isWinningMove(0, Player.PLAYER1)).toEqual({
        win: true,
        direction: Direction.VERTICAL,
        sequence: [0, 7, 14, 21],
      });
    });

    it("return true if it is vertically connected 2", () => {
      board.play(0, Player.PLAYER1);
      board.play(0, Player.PLAYER2);
      board.play(0, Player.PLAYER1);
      board.play(1, Player.PLAYER2);
      board.play(0, Player.PLAYER1);
      board.play(1, Player.PLAYER2);
      board.play(0, Player.PLAYER1);
      board.play(1, Player.PLAYER2);
      board.play(0, Player.PLAYER1);
      expect(board.isWinningMove(0, Player.PLAYER1)).toEqual({
        win: true,
        direction: Direction.VERTICAL,
        sequence: [14, 21, 28, 35],
      });
    });

    it("return true if it is vertically connected 3", () => {
      board.play(4, Player.PLAYER1);
      board.play(4, Player.PLAYER2);
      board.play(5, Player.PLAYER1);
      board.play(4, Player.PLAYER2);
      board.play(5, Player.PLAYER1);
      board.play(4, Player.PLAYER2);
      board.play(5, Player.PLAYER1);
      board.play(4, Player.PLAYER2);
      expect(board.isWinningMove(4, Player.PLAYER2)).toEqual({
        win: true,
        direction: Direction.VERTICAL,
        sequence: [11, 18, 25, 32],
      });
    });
  });

  describe("isWinningMove returns true if 4 pieces are connected together horizontally", () => {
    beforeEach(() => {
      board = new Board();
    });

    it("return true if it is horizontally connected and the winning piece is the second one of the connected 4", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [0, 2, 4, 5, 11].forEach(i => (grid[i] = Player.PLAYER1));
      [1, 3, 7, 8, 10, 9].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);
      expect(board.isWinningMove(2, Player.PLAYER2)).toEqual({
        win: true,
        direction: Direction.HORIZONTAL,
        sequence: [7, 8, 9, 10],
      });
    });

    it("return true if it is horizontally connected and the winning piece is the third one of the connected 4", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [1, 3, 5, 6, 13, 20].forEach(i => (grid[i] = Player.PLAYER1));
      [2, 4, 8, 9, 11, 10].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);
      expect(board.isWinningMove(3, Player.PLAYER2)).toEqual({
        win: true,
        direction: Direction.HORIZONTAL,
        sequence: [8, 9, 10, 11],
      });
    });

    it("return true if it is horizontally connected and the winning piece is the last one of the connected 4", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [3, 5, 10, 11, 12, 13].forEach(i => (grid[i] = Player.PLAYER1));
      [4, 6, 17, 18, 19].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);
      expect(board.isWinningMove(6, Player.PLAYER1)).toEqual({
        win: true,
        direction: Direction.HORIZONTAL,
        sequence: [10, 11, 12, 13],
      });
    });

    it("return true if it is horizontally connected and the winning piece is the first one of the connected 4", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [1, 3, 4, 5, 12, 19].forEach(i => (grid[i] = Player.PLAYER1));
      [2, 6, 9, 10, 11, 8].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);
      expect(board.isWinningMove(1, Player.PLAYER2)).toEqual({
        win: true,
        direction: Direction.HORIZONTAL,
        sequence: [8, 9, 10, 11],
      });
    });

    it("return true if it is horizontally connected and it is actually connect 5", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [1, 3, 4, 5, 15, 19, 22].forEach(i => (grid[i] = Player.PLAYER1));
      [2, 8, 9, 11, 12, 18, 10].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);
      expect(board.isWinningMove(3, Player.PLAYER2)).toEqual({
        win: true,
        direction: Direction.HORIZONTAL,
        sequence: [9, 10, 11, 12],
      });
    });
  });

  describe("isWinningMove returns true if 4 pieces are connected left diagonally", () => {
    beforeEach(() => {
      board = new Board();
    });

    it("return true and the winning piece is the second one of the connected 4", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [0, 1, 2, 9, 14, 15, 17, 29].forEach(i => (grid[i] = Player.PLAYER1));
      [3, 7, 8, 10, 21, 22, 28, 16].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);
      expect(board.isWinningMove(2, Player.PLAYER2)).toEqual({
        win: true,
        direction: Direction.LEFT_DIAG,
        sequence: [10, 16, 22, 28],
      });
    });

    it("return true if it is left-diagonally connected and the winning piece is the third one of the connected 4", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [1, 2, 9, 11, 15, 17, 29, 23].forEach(i => (grid[i] = Player.PLAYER1));
      [3, 4, 5, 8, 10, 16, 22].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);
      expect(board.isWinningMove(2, Player.PLAYER1)).toEqual({
        win: true,
        direction: Direction.LEFT_DIAG,
        sequence: [11, 17, 23, 29],
      });
    });

    it("return true if it is left-diagonally connected and the winning piece is the last one of the connected 4", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [0, 1, 3, 4, 8, 14, 17, 23, 29, 35].forEach(i => (grid[i] = Player.PLAYER1));
      [2, 7, 9, 10, 15, 16, 21, 22, 28].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);
      expect(board.isWinningMove(0, Player.PLAYER1)).toEqual({
        win: true,
        direction: Direction.LEFT_DIAG,
        sequence: [17, 23, 29, 35],
      });
    });

    it("return true if it is left-diagonally connected and the winning piece is the first one of the connected 4", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [2, 4, 8, 9, 10, 22, 24, 30, 36, 18].forEach(i => (grid[i] = Player.PLAYER1));
      [1, 3, 5, 11, 15, 16, 17, 23, 29].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);
      expect(board.isWinningMove(4, Player.PLAYER1)).toEqual({
        win: true,
        direction: Direction.LEFT_DIAG,
        sequence: [18, 24, 30, 36],
      });
    });
  });

  describe("isWinningMove returns true if 4 pieces are connected right diagonally", () => {
    beforeEach(() => {
      board = new Board();
    });

    it("return true and the winning piece is the second one of the connected 4", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [2, 6, 9, 11, 12, 16, 17, 26, 33, 25].forEach(i => (grid[i] = Player.PLAYER1));
      [1, 3, 4, 5, 8, 10, 18, 19, 23].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);
      expect(board.isWinningMove(4, Player.PLAYER1)).toEqual({
        win: true,
        direction: Direction.RIGHT_DIAG,
        sequence: [9, 17, 25, 33],
      });
    });

    it("return true and the winning piece is the third one of the connected 4", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [0, 2, 3, 7, 10, 11, 14, 15, 18, 31].forEach(i => (grid[i] = Player.PLAYER1));
      [1, 4, 8, 9, 17, 21, 24, 25, 32, 16].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);
      expect(board.isWinningMove(2, Player.PLAYER2)).toEqual({
        win: true,
        direction: Direction.RIGHT_DIAG,
        sequence: [8, 16, 24, 32],
      });
    });

    it("return true and the winning piece is the last one of the connected 4", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [0, 4, 5, 8, 9, 16, 23, 24, 31, 32, 39, 15].forEach(i => (grid[i] = Player.PLAYER1));
      [1, 2, 3, 10, 11, 12, 17, 18, 19, 25, 30].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);
      expect(board.isWinningMove(1, Player.PLAYER1)).toEqual({
        win: true,
        direction: Direction.RIGHT_DIAG,
        sequence: [15, 23, 31, 39],
      });
    });

    it("return true and the winning piece is the first one of the connected 4", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [2, 5, 10, 18, 19, 26].forEach(i => (grid[i] = Player.PLAYER1));
      [3, 4, 6, 11, 12].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);
      expect(board.isWinningMove(5, Player.PLAYER1)).toEqual({
        win: true,
        direction: Direction.RIGHT_DIAG,
        sequence: [2, 10, 18, 26],
      });
    });
  });

  describe("isWinningMove returns false if the game is not won", () => {
    beforeEach(() => {
      board = new Board();
    });

    it("return false if column is out of range", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [0].forEach(i => (grid[i] = Player.PLAYER1));
      [1].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);
      expect(board.isWinningMove(-1, Player.PLAYER1)).toEqual({
        win: false,
        direction: Direction.NONE,
        sequence: [],
      });
      expect(board.isWinningMove(7, Player.PLAYER1)).toEqual({
        win: false,
        direction: Direction.NONE,
        sequence: [],
      });
    });

    it("return false if the game is not won", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [0, 2, 3].forEach(i => (grid[i] = Player.PLAYER1));
      [1, 9, 10].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);
      expect(board.isWinningMove(3, Player.PLAYER1)).toEqual({
        win: false,
        direction: Direction.NONE,
        sequence: [],
      });
    });

    it("return false if the game is a draw", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [0, 2, 3, 5, 6, 10, 11, 15, 19, 20, 22, 25, 27, 28, 29, 30, 32, 33, 37, 38, 41].forEach(
        i => (grid[i] = Player.PLAYER1),
      );
      [1, 4, 7, 8, 9, 12, 13, 14, 16, 17, 18, 21, 23, 24, 26, 31, 34, 36, 39, 40].forEach(
        i => (grid[i] = Player.PLAYER2),
      );
      board.clone(grid);
      expect(board.isWinningMove(0, Player.PLAYER2)).toEqual({
        win: false,
        direction: Direction.NONE,
        sequence: [],
      });
    });
  });

  describe("isDraw returns true if the game is tied", () => {
    beforeEach(() => {
      board = new Board();
    });

    it("return true if the game is a draw", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [0, 2, 3, 5, 6, 10, 11, 15, 19, 20, 22, 25, 27, 28, 29, 30, 32, 33, 37, 38, 41].forEach(
        i => (grid[i] = Player.PLAYER1),
      );
      [1, 4, 7, 8, 9, 12, 13, 14, 16, 17, 18, 21, 23, 24, 26, 31, 34, 36, 39, 40, 35].forEach(
        i => (grid[i] = Player.PLAYER2),
      );
      board.clone(grid);
      expect(board.isDraw()).toBe(true);
    });

    it("return false if the game is not a draw", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [0, 2, 3].forEach(i => (grid[i] = Player.PLAYER1));
      [1, 9, 10].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);
      expect(board.isDraw()).toBe(false);
    });
  });

  describe("isFreeCell", () => {
    beforeEach(() => {
      board = new Board();
    });

    it("return true if the grid is a FREE_CELL", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [0, 2, 3, 17].forEach(i => (grid[i] = Player.PLAYER1));
      [1, 9, 10].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);

      expect(board.isFreeCell(1, 4)).toBe(true);
      expect(board.isFreeCell(2, 3)).toBe(false);
      expect(board.isFreeCell(1, 2)).toBe(false);
    });
  });

  describe("isSamePlayer", () => {
    beforeEach(() => {
      board = new Board();
    });

    it("return true if the grid is a FREE_CELL", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [0, 2, 3, 17].forEach(i => (grid[i] = Player.PLAYER1));
      [1, 9, 10].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);

      expect(board.isSamePlayer(1, 4, Player.PLAYER1)).toBe(false);
      expect(board.isSamePlayer(2, 3, Player.PLAYER1)).toBe(true);
      expect(board.isSamePlayer(1, 2, Player.PLAYER2)).toBe(true);
      expect(board.isSamePlayer(2, 3, Player.PLAYER2)).toBe(false);
      expect(board.isSamePlayer(1, 2, Player.PLAYER1)).toBe(false);
    });
  });

  describe("numPieces", () => {
    beforeEach(() => {
      board = new Board();
    });

    it("return true if the grid is a FREE_CELL", () => {
      const grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      [0, 2, 3, 17].forEach(i => (grid[i] = Player.PLAYER1));
      [1, 9, 10].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);

      expect(board.numPieces(Player.PLAYER1)).toBe(4);
      expect(board.numPieces(Player.PLAYER2)).toBe(3);
      expect(board.numPieces(Player.COMPUTER)).toBe(0);
    });
  });

  describe("generateChildBoards", () => {
    let grid: string[] = [];

    beforeEach(() => {
      grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      board = new Board();
    });

    it("generate all child boards when no column is full", () => {
      board.play(2, Player.PLAYER1);
      board.play(3, Player.COMPUTER);
      board.play(4, Player.PLAYER1);
      board.play(2, Player.COMPUTER);
      board.play(2, Player.PLAYER1);
      board.play(2, Player.COMPUTER);
      board.play(2, Player.PLAYER1);

      const childBoards = board.generateChildBoards();
      expect(childBoards.length).toEqual(COLUMNS);

      [2, 4, 16, 30].forEach(i => (grid[i] = Player.PLAYER1));
      [3, 9, 23].forEach(i => (grid[i] = Player.COMPUTER));
      expect(board.newGrid).toEqual(grid);

      const idxNextPiece = [0, 1, 37, 10, 11, 5, 6];
      for (let column = 0; column < COLUMNS; column++) {
        grid = [];
        for (let i = 0; i < ROWS * COLUMNS; i++) {
          grid.push(FREE_CELL);
        }
        [2, 4, 16, 30].forEach(i => (grid[i] = Player.PLAYER1));
        [3, 9, 23].forEach(i => (grid[i] = Player.COMPUTER));
        grid[idxNextPiece[column]] = Player.COMPUTER;
        expect(childBoards[column].column).toEqual(column);
        expect(childBoards[column].board.newGrid).toEqual(grid);
      }
    });

    it("generate child boards for non-full columns", () => {
      board.play(2, Player.PLAYER1);
      board.play(3, Player.COMPUTER);
      board.play(4, Player.PLAYER1);
      board.play(2, Player.COMPUTER);
      board.play(2, Player.PLAYER1);
      board.play(2, Player.COMPUTER);
      board.play(2, Player.PLAYER1);
      board.play(2, Player.COMPUTER);
      board.play(3, Player.PLAYER1);
      board.play(3, Player.COMPUTER);
      board.play(1, Player.PLAYER1);
      board.play(0, Player.COMPUTER);
      board.play(3, Player.PLAYER1);

      const childBoards = board.generateChildBoards();
      expect(childBoards.length).toEqual(COLUMNS - 1);

      [1, 2, 4, 10, 16, 24, 30].forEach(i => (grid[i] = Player.PLAYER1));
      [0, 3, 9, 17, 23, 37].forEach(i => (grid[i] = Player.COMPUTER));
      expect(board.newGrid).toEqual(grid);

      const idxNextPiece = [7, 8, 31, 11, 5, 6];
      for (let column = 0; column < COLUMNS - 1; column++) {
        grid = [];
        for (let i = 0; i < ROWS * COLUMNS; i++) {
          grid.push(FREE_CELL);
        }
        [1, 2, 4, 10, 16, 24, 30].forEach(i => (grid[i] = Player.PLAYER1));
        [0, 3, 9, 17, 23, 37].forEach(i => (grid[i] = Player.COMPUTER));
        grid[idxNextPiece[column]] = Player.COMPUTER;
        expect(childBoards[column].column).toEqual(column < 2 ? column : column + 1);
        expect(childBoards[column].board.newGrid).toEqual(grid);
      }
    });
  });

  describe("print", () => {
    let grid: string[] = [];
    beforeEach(() => {
      grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
    });

    it("print correct board", () => {
      grid[1] = Player.PLAYER1;
      grid[2] = Player.PLAYER2;
      grid[8] = Player.PLAYER1;
      grid[15] = Player.PLAYER2;
      grid[9] = Player.PLAYER1;
      grid[3] = Player.PLAYER2;
      board = new Board();
      board.clone(grid);

      expect(board.print()).toEqual(
        "- - - - - - - \n- - - - - - - \n- - - - - - - \n- x - - - - - \n- o o - - - - \n- o x x - - - \n",
      );
    });
  });
});
