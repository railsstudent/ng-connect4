import "es6-object-assign";
import {
  reducer as connectReducer,
  initialState,
  ConnectState,
  selectGrid,
  selectResetGame,
  selectNextPlayer,
  selectMovesLeft,
  selectColumnAvailable,
  selectOutcome,
  selectWinningSequence,
  selectMode,
  selectLastMove,
} from "./connect.reducer";
import { Board } from "../util/board";
import { ROWS, COLUMNS, FREE_CELL, Player, Outcome, Mode, Direction } from "../models";
import * as connectActions from "./connect.actions";

let grid: string[] = [];
let board: Board;

const initColumnsAvailable = (len: number, flag: boolean) => {
  const values = [];
  for (let i = 0; i < len; i++) {
    values.push(flag);
  }
  return values;
};

describe("Connect Reducer", () => {
  describe("unknown action", () => {
    it("should return the initial state", () => {
      const action = {} as any;

      const result = connectReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe("NewGame action", () => {
    it("should return the initial state", () => {
      const action = connectActions.NewGameAction({
        mode: Mode.HUMAN_VS_HUMAN,
      });
      board = new Board();
      const result = connectReducer(
        {
          board,
          nextPlayer: Player.PLAYER1,
          outcome: Outcome.PLAYER1_WINS,
          winningSequence: [1, 8, 15, 22],
          direction: Direction.VERTICAL,
          reset: true,
          columnAvailable: initColumnsAvailable(COLUMNS, false),
          mode: Mode.HUMAN_VS_HUMAN,
          lastMove: null,
        },
        action,
      );

      expect(result).toEqual(Object.assign({}, initialState, { mode: Mode.HUMAN_VS_HUMAN }));
    });
  });

  describe("PlayerOneMove action", () => {
    beforeEach(() => {
      board = new Board();
      grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
    });

    it("should allow player 1 to make move in human vs human mode", () => {
      grid[0] = Player.PLAYER1;
      grid[1] = Player.PLAYER2;
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.PLAYER1,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_HUMAN,
        lastMove: null,
      };
      const action = connectActions.PlayerOneMoveAction({
        mode: Mode.HUMAN_VS_HUMAN,
        player: Player.PLAYER1,
        column: 2,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      cloneGrid[0] = Player.PLAYER1;
      cloneGrid[1] = Player.PLAYER2;
      cloneGrid[2] = Player.PLAYER1;
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.DEFAULT);
      expect(state.reset).toEqual(false);
      expect(state.nextPlayer).toEqual(Player.PLAYER2);
      expect(state.winningSequence).toEqual([]);
      expect(state.direction).toEqual(Direction.NONE);
      expect(state.columnAvailable).toEqual(initColumnsAvailable(COLUMNS, true));
      expect(state.mode).toEqual(Mode.HUMAN_VS_HUMAN);
      expect(state.lastMove).toEqual({ row: 0, col: 2 });
    });

    it("should allow player 1 to make move in human vs computer mode", () => {
      grid[0] = Player.PLAYER1;
      grid[7] = Player.COMPUTER;
      grid[14] = Player.PLAYER1;
      grid[21] = Player.COMPUTER;
      grid[28] = Player.PLAYER1;
      grid[1] = Player.COMPUTER;
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.PLAYER1,
        outcome: Outcome.DEFAULT,
        reset: false,
        winningSequence: null,
        direction: null,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_COMPUTER,
        lastMove: null,
      };
      const action = connectActions.PlayerOneMoveAction({
        mode: Mode.HUMAN_VS_COMPUTER,
        player: Player.PLAYER1,
        column: 0,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      cloneGrid[0] = Player.PLAYER1;
      cloneGrid[7] = Player.COMPUTER;
      cloneGrid[14] = Player.PLAYER1;
      cloneGrid[21] = Player.COMPUTER;
      cloneGrid[28] = Player.PLAYER1;
      cloneGrid[1] = Player.COMPUTER;
      cloneGrid[35] = Player.PLAYER1;
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.DEFAULT);
      expect(state.reset).toEqual(false);
      expect(state.nextPlayer).toEqual(Player.COMPUTER);
      expect(state.winningSequence).toEqual([]);
      expect(state.direction).toEqual(Direction.NONE);
      const expected = [];
      expected.push(false);
      for (let i = 1; i < COLUMNS; i++) {
        expected.push(true);
      }
      expect(state.columnAvailable).toEqual(expected);
      expect(state.mode).toEqual(Mode.HUMAN_VS_COMPUTER);
      expect(state.lastMove).toEqual({ row: 5, col: 0 });
    });

    it("should stop the game after player 1 wins the game", () => {
      grid[2] = Player.PLAYER1;
      grid[3] = Player.COMPUTER;
      grid[10] = Player.PLAYER1;
      grid[4] = Player.COMPUTER;
      grid[5] = Player.PLAYER1;
      grid[11] = Player.COMPUTER;
      grid[12] = Player.PLAYER1;
      grid[17] = Player.COMPUTER;
      grid[18] = Player.PLAYER1;
      grid[19] = Player.COMPUTER;
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.PLAYER1,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_COMPUTER,
        lastMove: null,
      };
      const action = connectActions.PlayerOneMoveAction({
        mode: Mode.HUMAN_VS_COMPUTER,
        player: Player.PLAYER1,
        column: 5,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      cloneGrid[2] = Player.PLAYER1;
      cloneGrid[3] = Player.COMPUTER;
      cloneGrid[10] = Player.PLAYER1;
      cloneGrid[4] = Player.COMPUTER;
      cloneGrid[5] = Player.PLAYER1;
      cloneGrid[11] = Player.COMPUTER;
      cloneGrid[12] = Player.PLAYER1;
      cloneGrid[17] = Player.COMPUTER;
      cloneGrid[18] = Player.PLAYER1;
      cloneGrid[19] = Player.COMPUTER;
      cloneGrid[26] = Player.PLAYER1;
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.PLAYER1_WINS);
      expect(state.reset).toEqual(true);
      expect(state.nextPlayer).toEqual(Player.COMPUTER);
      expect(state.winningSequence).toEqual([2, 10, 18, 26]);
      expect(state.direction).toEqual(Direction.RIGHT_DIAG);
      expect(state.columnAvailable).toEqual(initColumnsAvailable(COLUMNS, false));
      expect(state.mode).toEqual(Mode.HUMAN_VS_COMPUTER);
      expect(state.lastMove).toEqual({ row: 3, col: 5 });
    });
  });

  describe("PlayerTwoMove action", () => {
    beforeEach(() => {
      board = new Board();
      grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
    });

    it("should allow player 2 to make move", () => {
      grid[1] = Player.PLAYER1;
      grid[2] = Player.PLAYER2;
      grid[8] = Player.PLAYER1;
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.PLAYER2,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_HUMAN,
        lastMove: null,
      };
      const action = connectActions.PlayerTwoMoveAction({
        player: Player.PLAYER2,
        column: 1,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      cloneGrid[1] = Player.PLAYER1;
      cloneGrid[2] = Player.PLAYER2;
      cloneGrid[8] = Player.PLAYER1;
      cloneGrid[15] = Player.PLAYER2;
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.DEFAULT);
      expect(state.reset).toEqual(false);
      expect(state.nextPlayer).toEqual(Player.PLAYER1);
      expect(state.winningSequence).toEqual([]);
      expect(state.direction).toEqual(Direction.NONE);
      expect(state.columnAvailable).toEqual(initColumnsAvailable(COLUMNS, true));
      expect(state.mode).toEqual(Mode.HUMAN_VS_HUMAN);
      expect(state.lastMove).toEqual({ row: 2, col: 1 });
    });

    it("should should make the column unavailable after player 2 makes a move", () => {
      grid[1] = Player.PLAYER1;
      grid[2] = Player.PLAYER2;
      grid[8] = Player.PLAYER1;
      grid[15] = Player.PLAYER2;
      grid[3] = Player.PLAYER1;
      grid[22] = Player.PLAYER2;
      grid[29] = Player.PLAYER1;
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.PLAYER2,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_HUMAN,
        lastMove: null,
      };
      const action = connectActions.PlayerTwoMoveAction({
        player: Player.PLAYER2,
        column: 1,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      cloneGrid[1] = Player.PLAYER1;
      cloneGrid[2] = Player.PLAYER2;
      cloneGrid[8] = Player.PLAYER1;
      cloneGrid[15] = Player.PLAYER2;
      cloneGrid[3] = Player.PLAYER1;
      cloneGrid[22] = Player.PLAYER2;
      cloneGrid[29] = Player.PLAYER1;
      cloneGrid[36] = Player.PLAYER2;
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.DEFAULT);
      expect(state.reset).toEqual(false);
      expect(state.nextPlayer).toEqual(Player.PLAYER1);
      expect(state.winningSequence).toEqual([]);
      expect(state.direction).toEqual(Direction.NONE);
      const expected = initColumnsAvailable(COLUMNS, true);
      expected[1] = false;
      expect(state.columnAvailable).toEqual(expected);
      expect(state.mode).toEqual(Mode.HUMAN_VS_HUMAN);
      expect(state.lastMove).toEqual({ row: 5, col: 1 });
    });

    it("should stop the game after player 2 wins the game", () => {
      [1, 2, 4, 8, 9, 16, 24].forEach(i => (grid[i] = Player.PLAYER1));
      [3, 5, 10, 17, 23].forEach(i => (grid[i] = Player.PLAYER2));
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.PLAYER2,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_HUMAN,
        lastMove: null,
      };
      const action = connectActions.PlayerTwoMoveAction({
        player: Player.PLAYER2,
        column: 4,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      [1, 2, 4, 8, 9, 16, 24].forEach(i => (cloneGrid[i] = Player.PLAYER1));
      [3, 5, 10, 17, 23, 11].forEach(i => (cloneGrid[i] = Player.PLAYER2));
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.PLAYER2_WINS);
      expect(state.reset).toEqual(true);
      expect(state.nextPlayer).toEqual(Player.PLAYER1);
      expect(state.winningSequence).toEqual([5, 11, 17, 23]);
      expect(state.direction).toEqual(Direction.LEFT_DIAG);
      expect(state.columnAvailable).toEqual(initColumnsAvailable(COLUMNS, false));
      expect(state.mode).toEqual(Mode.HUMAN_VS_HUMAN);
      expect(state.lastMove).toEqual({ row: 1, col: 4 });
    });

    it("should stop the game after player 2 wins the game on the last move", () => {
      [0, 1, 2, 4, 7, 9, 13, 14, 15, 18, 19, 23, 24, 25, 28, 29, 30, 32, 33, 34, 37].forEach(
        i => (grid[i] = Player.PLAYER1),
      );
      [3, 5, 6, 8, 10, 11, 12, 16, 17, 20, 21, 22, 26, 27, 31, 35, 36, 38, 39, 41].forEach(
        i => (grid[i] = Player.PLAYER2),
      );
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.PLAYER2,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_HUMAN,
        lastMove: null,
      };
      const action = connectActions.PlayerTwoMoveAction({
        player: Player.PLAYER2,
        column: 5,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      [0, 1, 2, 4, 7, 9, 13, 14, 15, 18, 19, 23, 24, 25, 28, 29, 30, 32, 33, 34, 37].forEach(
        i => (cloneGrid[i] = Player.PLAYER1),
      );
      [3, 5, 6, 8, 10, 11, 12, 16, 17, 20, 21, 22, 26, 27, 31, 35, 36, 38, 39, 40, 41].forEach(
        i => (cloneGrid[i] = Player.PLAYER2),
      );
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.PLAYER2_WINS);
      expect(state.reset).toEqual(true);
      expect(state.nextPlayer).toEqual(Player.PLAYER1);
      expect(state.winningSequence).toEqual([38, 39, 40, 41]);
      expect(state.direction).toEqual(Direction.HORIZONTAL);
      expect(state.columnAvailable).toEqual(initColumnsAvailable(COLUMNS, false));
      expect(state.mode).toEqual(Mode.HUMAN_VS_HUMAN);
      expect(state.lastMove).toEqual({ row: 5, col: 5 });
    });

    it("should stop the game after player 2 draw the game", () => {
      [1, 2, 5, 7, 8, 9, 11, 13, 15, 16, 17, 19, 24, 29, 30, 33, 34, 35, 37, 38, 39].forEach(
        i => (grid[i] = Player.PLAYER1),
      );
      [0, 3, 4, 6, 10, 12, 14, 18, 20, 21, 22, 23, 25, 26, 27, 28, 31, 32, 40, 41].forEach(
        i => (grid[i] = Player.PLAYER2),
      );
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.PLAYER2,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_HUMAN,
        lastMove: null,
      };
      const action = connectActions.PlayerTwoMoveAction({
        player: Player.PLAYER2,
        column: 1,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      [1, 2, 5, 7, 8, 9, 11, 13, 15, 16, 17, 19, 24, 29, 30, 33, 34, 35, 37, 38, 39].forEach(
        i => (cloneGrid[i] = Player.PLAYER1),
      );
      [0, 3, 4, 6, 10, 12, 14, 18, 20, 21, 22, 23, 25, 26, 27, 28, 31, 32, 40, 41, 36].forEach(
        i => (cloneGrid[i] = Player.PLAYER2),
      );
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.DRAW);
      expect(state.reset).toEqual(true);
      expect(state.nextPlayer).toEqual(Player.PLAYER1);
      expect(state.winningSequence).toEqual([]);
      expect(state.columnAvailable).toEqual(initColumnsAvailable(COLUMNS, false));
      expect(state.mode).toEqual(Mode.HUMAN_VS_HUMAN);
      expect(state.lastMove).toEqual({ row: 5, col: 1 });
    });
  });

  describe("ComputerMove action", () => {
    beforeEach(() => {
      board = new Board();
      grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
    });

    it("should allow computer to make move", () => {
      grid[1] = Player.PLAYER1;
      grid[2] = Player.COMPUTER;
      grid[8] = Player.PLAYER1;
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.COMPUTER,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_COMPUTER,
        lastMove: null,
      };
      const action = connectActions.ComputerMoveAction({
        player: Player.COMPUTER,
        column: 1,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      cloneGrid[1] = Player.PLAYER1;
      cloneGrid[2] = Player.COMPUTER;
      cloneGrid[8] = Player.PLAYER1;
      cloneGrid[15] = Player.COMPUTER;
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.DEFAULT);
      expect(state.reset).toEqual(false);
      expect(state.nextPlayer).toEqual(Player.PLAYER1);
      expect(state.winningSequence).toEqual([]);
      expect(state.direction).toEqual(Direction.NONE);
      expect(state.columnAvailable).toEqual(initColumnsAvailable(COLUMNS, true));
      expect(state.mode).toEqual(Mode.HUMAN_VS_COMPUTER);
      expect(state.lastMove).toEqual({ row: 2, col: 1 });
    });

    it("should make the column unavailable after computer makes a move", () => {
      grid[1] = Player.PLAYER1;
      grid[2] = Player.COMPUTER;
      grid[8] = Player.PLAYER1;
      grid[15] = Player.COMPUTER;
      grid[3] = Player.PLAYER1;
      grid[22] = Player.COMPUTER;
      grid[29] = Player.PLAYER1;
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.COMPUTER,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_COMPUTER,
        lastMove: null,
      };
      const action = connectActions.ComputerMoveAction({
        player: Player.COMPUTER,
        column: 1,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      cloneGrid[1] = Player.PLAYER1;
      cloneGrid[2] = Player.COMPUTER;
      cloneGrid[8] = Player.PLAYER1;
      cloneGrid[15] = Player.COMPUTER;
      cloneGrid[3] = Player.PLAYER1;
      cloneGrid[22] = Player.COMPUTER;
      cloneGrid[29] = Player.PLAYER1;
      cloneGrid[36] = Player.COMPUTER;
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.DEFAULT);
      expect(state.reset).toEqual(false);
      expect(state.nextPlayer).toEqual(Player.PLAYER1);
      expect(state.winningSequence).toEqual([]);
      expect(state.direction).toEqual(Direction.NONE);

      const expected = initColumnsAvailable(COLUMNS, true);
      expected[1] = false;
      expect(state.columnAvailable).toEqual(expected);
      expect(state.mode).toEqual(Mode.HUMAN_VS_COMPUTER);
      expect(state.lastMove).toEqual({ row: 5, col: 1 });
    });

    it("should stop the game after computer wins the game", () => {
      [1, 2, 4, 8, 9, 16, 24].forEach(i => (grid[i] = Player.PLAYER1));
      [3, 5, 10, 17, 23].forEach(i => (grid[i] = Player.COMPUTER));
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.COMPUTER,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_COMPUTER,
        lastMove: null,
      };
      const action = connectActions.ComputerMoveAction({
        player: Player.COMPUTER,
        column: 4,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      [1, 2, 4, 8, 9, 16, 24].forEach(i => (cloneGrid[i] = Player.PLAYER1));
      [3, 5, 10, 17, 23, 11].forEach(i => (cloneGrid[i] = Player.COMPUTER));
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.COMPUTER_WINS);
      expect(state.winningSequence).toEqual([5, 11, 17, 23]);
      expect(state.reset).toEqual(true);
      expect(state.nextPlayer).toEqual(Player.PLAYER1);
      expect(state.winningSequence).toEqual([5, 11, 17, 23]);
      expect(state.direction).toEqual(Direction.LEFT_DIAG);
      expect(state.columnAvailable).toEqual(initColumnsAvailable(COLUMNS, false));
      expect(state.mode).toEqual(Mode.HUMAN_VS_COMPUTER);
      expect(state.lastMove).toEqual({ row: 1, col: 4 });
    });

    it("should stop the game after computer wins the game on the last move", () => {
      [0, 1, 2, 4, 7, 9, 13, 14, 15, 18, 19, 23, 24, 25, 28, 29, 30, 32, 33, 34, 37].forEach(
        i => (grid[i] = Player.PLAYER1),
      );
      [3, 5, 6, 8, 10, 11, 12, 16, 17, 20, 21, 22, 26, 27, 31, 35, 36, 38, 39, 41].forEach(
        i => (grid[i] = Player.COMPUTER),
      );
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.COMPUTER,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_COMPUTER,
        lastMove: null,
      };
      const action = connectActions.ComputerMoveAction({
        player: Player.COMPUTER,
        column: 5,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      [0, 1, 2, 4, 7, 9, 13, 14, 15, 18, 19, 23, 24, 25, 28, 29, 30, 32, 33, 34, 37].forEach(
        i => (cloneGrid[i] = Player.PLAYER1),
      );
      [3, 5, 6, 8, 10, 11, 12, 16, 17, 20, 21, 22, 26, 27, 31, 35, 36, 38, 39, 40, 41].forEach(
        i => (cloneGrid[i] = Player.COMPUTER),
      );
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.COMPUTER_WINS);
      expect(state.reset).toEqual(true);
      expect(state.nextPlayer).toEqual(Player.PLAYER1);
      expect(state.winningSequence).toEqual([38, 39, 40, 41]);
      expect(state.direction).toEqual(Direction.HORIZONTAL);
      expect(state.columnAvailable).toEqual(initColumnsAvailable(COLUMNS, false));
      expect(state.mode).toEqual(Mode.HUMAN_VS_COMPUTER);
      expect(state.lastMove).toEqual({ row: 5, col: 5 });
    });

    it("should stop the game after computer draws the game", () => {
      [1, 2, 5, 7, 8, 9, 11, 13, 15, 16, 17, 19, 24, 29, 30, 33, 34, 35, 37, 38, 39].forEach(
        i => (grid[i] = Player.PLAYER1),
      );
      [0, 3, 4, 6, 10, 12, 14, 18, 20, 21, 22, 23, 25, 26, 27, 28, 31, 32, 40, 41].forEach(
        i => (grid[i] = Player.COMPUTER),
      );
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.COMPUTER,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_COMPUTER,
        lastMove: null,
      };
      const action = connectActions.ComputerMoveAction({
        player: Player.COMPUTER,
        column: 1,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      [1, 2, 5, 7, 8, 9, 11, 13, 15, 16, 17, 19, 24, 29, 30, 33, 34, 35, 37, 38, 39].forEach(
        i => (cloneGrid[i] = Player.PLAYER1),
      );
      [0, 3, 4, 6, 10, 12, 14, 18, 20, 21, 22, 23, 25, 26, 27, 28, 31, 32, 40, 41, 36].forEach(
        i => (cloneGrid[i] = Player.COMPUTER),
      );
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.DRAW);
      expect(state.reset).toEqual(true);
      expect(state.nextPlayer).toEqual(Player.PLAYER1);
      expect(state.winningSequence).toEqual([]);
      expect(state.direction).toEqual(Direction.NONE);
      expect(state.columnAvailable).toEqual(initColumnsAvailable(COLUMNS, false));
      expect(state.mode).toEqual(Mode.HUMAN_VS_COMPUTER);
      expect(state.lastMove).toEqual({ row: 5, col: 1 });
    });
  });

  describe("ChooseMode action", () => {
    beforeEach(() => {
      board = new Board();
      grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
    });

    it("should allow return initial state", () => {
      grid[1] = Player.PLAYER1;
      grid[2] = Player.COMPUTER;
      grid[8] = Player.PLAYER1;
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.COMPUTER,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_COMPUTER,
        lastMove: null,
      };
      const action = connectActions.ChooseModeAction();
      const state = connectReducer(TEST_INITIAL_STATE, action);

      expect(state).toEqual(initialState);
    });

    it("should make the column unavailable after computer makes a move", () => {
      grid[1] = Player.PLAYER1;
      grid[2] = Player.COMPUTER;
      grid[8] = Player.PLAYER1;
      grid[15] = Player.COMPUTER;
      grid[3] = Player.PLAYER1;
      grid[22] = Player.COMPUTER;
      grid[29] = Player.PLAYER1;
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.COMPUTER,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_COMPUTER,
        lastMove: null,
      };
      const action = connectActions.ComputerMoveAction({
        player: Player.COMPUTER,
        column: 1,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      cloneGrid[1] = Player.PLAYER1;
      cloneGrid[2] = Player.COMPUTER;
      cloneGrid[8] = Player.PLAYER1;
      cloneGrid[15] = Player.COMPUTER;
      cloneGrid[3] = Player.PLAYER1;
      cloneGrid[22] = Player.COMPUTER;
      cloneGrid[29] = Player.PLAYER1;
      cloneGrid[36] = Player.COMPUTER;
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.DEFAULT);
      expect(state.reset).toEqual(false);
      expect(state.nextPlayer).toEqual(Player.PLAYER1);
      expect(state.winningSequence).toEqual([]);
      expect(state.direction).toEqual(Direction.NONE);

      const expected = initColumnsAvailable(COLUMNS, true);
      expected[1] = false;
      expect(state.columnAvailable).toEqual(expected);
      expect(state.mode).toEqual(Mode.HUMAN_VS_COMPUTER);
      expect(state.lastMove).toEqual({ row: 5, col: 1 });
    });

    it("should stop the game after computer wins the game", () => {
      [1, 2, 4, 8, 9, 16, 24].forEach(i => (grid[i] = Player.PLAYER1));
      [3, 5, 10, 17, 23].forEach(i => (grid[i] = Player.COMPUTER));
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.COMPUTER,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_COMPUTER,
        lastMove: null,
      };
      const action = connectActions.ComputerMoveAction({
        player: Player.COMPUTER,
        column: 4,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      [1, 2, 4, 8, 9, 16, 24].forEach(i => (cloneGrid[i] = Player.PLAYER1));
      [3, 5, 10, 17, 23, 11].forEach(i => (cloneGrid[i] = Player.COMPUTER));
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.COMPUTER_WINS);
      expect(state.winningSequence).toEqual([5, 11, 17, 23]);
      expect(state.reset).toEqual(true);
      expect(state.nextPlayer).toEqual(Player.PLAYER1);
      expect(state.winningSequence).toEqual([5, 11, 17, 23]);
      expect(state.direction).toEqual(Direction.LEFT_DIAG);
      expect(state.columnAvailable).toEqual(initColumnsAvailable(COLUMNS, false));
      expect(state.mode).toEqual(Mode.HUMAN_VS_COMPUTER);
      expect(state.lastMove).toEqual({ row: 1, col: 4 });
    });

    it("should stop the game after computer wins the game on the last move", () => {
      [0, 1, 2, 4, 7, 9, 13, 14, 15, 18, 19, 23, 24, 25, 28, 29, 30, 32, 33, 34, 37].forEach(
        i => (grid[i] = Player.PLAYER1),
      );
      [3, 5, 6, 8, 10, 11, 12, 16, 17, 20, 21, 22, 26, 27, 31, 35, 36, 38, 39, 41].forEach(
        i => (grid[i] = Player.COMPUTER),
      );
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.COMPUTER,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_COMPUTER,
        lastMove: null,
      };
      const action = connectActions.ComputerMoveAction({
        player: Player.COMPUTER,
        column: 5,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      [0, 1, 2, 4, 7, 9, 13, 14, 15, 18, 19, 23, 24, 25, 28, 29, 30, 32, 33, 34, 37].forEach(
        i => (cloneGrid[i] = Player.PLAYER1),
      );
      [3, 5, 6, 8, 10, 11, 12, 16, 17, 20, 21, 22, 26, 27, 31, 35, 36, 38, 39, 40, 41].forEach(
        i => (cloneGrid[i] = Player.COMPUTER),
      );
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.COMPUTER_WINS);
      expect(state.reset).toEqual(true);
      expect(state.nextPlayer).toEqual(Player.PLAYER1);
      expect(state.winningSequence).toEqual([38, 39, 40, 41]);
      expect(state.direction).toEqual(Direction.HORIZONTAL);
      expect(state.columnAvailable).toEqual(initColumnsAvailable(COLUMNS, false));
      expect(state.mode).toEqual(Mode.HUMAN_VS_COMPUTER);
      expect(state.lastMove).toEqual({ row: 5, col: 5 });
    });

    it("should stop the game after computer draws the game", () => {
      [1, 2, 5, 7, 8, 9, 11, 13, 15, 16, 17, 19, 24, 29, 30, 33, 34, 35, 37, 38, 39].forEach(
        i => (grid[i] = Player.PLAYER1),
      );
      [0, 3, 4, 6, 10, 12, 14, 18, 20, 21, 22, 23, 25, 26, 27, 28, 31, 32, 40, 41].forEach(
        i => (grid[i] = Player.COMPUTER),
      );
      board.clone(grid);

      const TEST_INITIAL_STATE: ConnectState = {
        board,
        nextPlayer: Player.COMPUTER,
        outcome: Outcome.DEFAULT,
        winningSequence: null,
        direction: null,
        reset: false,
        columnAvailable: initColumnsAvailable(COLUMNS, true),
        mode: Mode.HUMAN_VS_COMPUTER,
        lastMove: null,
      };
      const action = connectActions.ComputerMoveAction({
        player: Player.COMPUTER,
        column: 1,
      });
      const state = connectReducer(TEST_INITIAL_STATE, action);

      const cloneGrid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        cloneGrid.push(FREE_CELL);
      }
      [1, 2, 5, 7, 8, 9, 11, 13, 15, 16, 17, 19, 24, 29, 30, 33, 34, 35, 37, 38, 39].forEach(
        i => (cloneGrid[i] = Player.PLAYER1),
      );
      [0, 3, 4, 6, 10, 12, 14, 18, 20, 21, 22, 23, 25, 26, 27, 28, 31, 32, 40, 41, 36].forEach(
        i => (cloneGrid[i] = Player.COMPUTER),
      );
      const nextBoard = new Board();
      nextBoard.clone(cloneGrid);

      expect(state.board).toEqual(nextBoard);
      expect(state.outcome).toEqual(Outcome.DRAW);
      expect(state.reset).toEqual(true);
      expect(state.nextPlayer).toEqual(Player.PLAYER1);
      expect(state.winningSequence).toEqual([]);
      expect(state.direction).toEqual(Direction.NONE);
      expect(state.columnAvailable).toEqual(initColumnsAvailable(COLUMNS, false));
      expect(state.mode).toEqual(Mode.HUMAN_VS_COMPUTER);
      expect(state.lastMove).toEqual({ row: 5, col: 1 });
    });
  });

  describe("selectors", () => {
    let connectState: ConnectState;
    beforeEach(() => {
      board = new Board();
      grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL);
      }
      grid[0] = "-";
      grid[1] = "o";
      grid[2] = "o";
      grid[3] = "x";
      grid[4] = "-";
      grid[5] = "-";
      grid[6] = "-";
      board.clone(grid);

      connectState = {
        board,
        nextPlayer: Player.COMPUTER,
        outcome: Outcome.PLAYER1_WINS,
        winningSequence: [0, 7, 14, 21],
        direction: Direction.VERTICAL,
        reset: false,
        columnAvailable: [false, true, true, true, false, true, false],
        mode: Mode.HUMAN_VS_HUMAN,
        lastMove: { row: 0, col: 3 },
      };
    });

    it("selectGrid should return grid", () => {
      const result = selectGrid.projector(connectState);
      const expected = board;
      expect(result).toEqual({
        board: expected,
        reset: false,
        nextPlayer: Player.COMPUTER,
      });
    });

    it("selectColumnAvailable should return column full status", () => {
      const result = selectColumnAvailable.projector(connectState);
      const expected = [false, true, true, true, false, true, false];
      result.forEach((p, i) => {
        expect(p).toBe(expected[i]);
      });
    });

    it("selectMovesLeft should return number of moves left", () => {
      expect(selectMovesLeft.projector({ board })).toBe(ROWS * COLUMNS - 3);
    });

    it("selectResetGame should return false", () => {
      expect(selectResetGame.projector(connectState)).toBe(false);
    });

    it("selectOutcome should return game outcome", () => {
      expect(selectOutcome.projector(connectState)).toEqual(Outcome.PLAYER1_WINS);
    });

    it("selectNextPlayer should return reset and next player", () => {
      expect(selectNextPlayer.projector(connectState)).toEqual({
        nextPlayer: Player.COMPUTER,
      });
    });

    it("selectWinningSequence should return winning sequence", () =>
      expect(selectWinningSequence.projector(connectState)).toEqual({
        direction: Direction.VERTICAL,
        sequence: [0, 7, 14, 21],
        winner: Player.PLAYER1,
      }));

    it("selectMode should return connect game mode", () =>
      expect(selectMode.projector(connectState)).toEqual(Mode.HUMAN_VS_HUMAN));

    it("selectLastMove should return last player move", () => {
      const result = {
        lastMove: {
          row: 0,
          col: 3,
        },
        lastMoveIdx: 38,
      };
      expect(selectLastMove.projector(connectState)).toEqual(result);
    });
  });
});
