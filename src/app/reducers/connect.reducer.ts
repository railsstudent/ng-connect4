import { ConnectActionTypes, ConnectActions } from "./connect.actions";
import { Player, Outcome, ROWS, COLUMNS, FREE_CELL, Mode } from "../models";
import { GridUtil } from "../util/grid.util";

export interface ConnectState {
  grid: string[];
  nextPlayer: Player;
  movesLeft: number;
  outcome: Outcome;
  reset: boolean;
  columnAvailable: boolean[];
}

const initBoard = () => {
  const grid = [];
  for (let i = 0; i < ROWS * COLUMNS; i++) {
    grid.push(FREE_CELL);
  }
  return grid;
};

const initColumns = () => {
  const columns = [];
  for (let i = 0; i < COLUMNS; i++) {
    columns.push(true);
  }
  return columns;
};

export const initialState: ConnectState = {
  grid: initBoard(),
  nextPlayer: Player.PLAYER1,
  movesLeft: ROWS * COLUMNS,
  outcome: Outcome.DEFAULT,
  reset: false,
  columnAvailable: initColumns()
};

export function connectReducer(
  state = initialState,
  action: ConnectActions
): ConnectState {
  const gridUtil = new GridUtil();
  let isWinningMove: boolean;
  let outcome: Outcome;
  let nextPlayer: Player;
  let columnAvailable = [];
  let mode: Mode;
  let player: Player;
  let column: number;
  let draw: boolean;
  let reset: boolean;

  switch (action.type) {
    case ConnectActionTypes.Player1Move:
      mode = action.payload.mode;
      player = action.payload.player;
      column = action.payload.column;

      gridUtil.setGrid(state.grid);
      isWinningMove = gridUtil.isWinningMove(column, player);
      draw = gridUtil.isDraw();
      outcome = Outcome.DEFAULT;
      reset = isWinningMove || draw;
      if (isWinningMove === true) {
        outcome = Outcome.PLAYER1_WINS;
        gridUtil.play(column, player);
      } else if (draw === true) {
        outcome = Outcome.DRAW;
      } else {
        gridUtil.play(column, player);
      }
      nextPlayer =
        mode === Mode.HUMAN_VS_HUMAN ? Player.PLAYER2 : Player.COMPUTER;
      columnAvailable = [];
      for (let i = 0; i < COLUMNS; i++) {
        columnAvailable.push(gridUtil.canPlay(i));
      }
      return {
        grid: gridUtil.newGrid,
        nextPlayer,
        movesLeft: state.movesLeft - 1,
        outcome,
        reset,
        columnAvailable
      };
    case ConnectActionTypes.Player2Move:
      player = action.payload.player;
      column = action.payload.column;

      gridUtil.setGrid(state.grid);
      isWinningMove = gridUtil.isWinningMove(column, player);
      draw = gridUtil.isDraw();
      outcome = Outcome.DEFAULT;
      reset = isWinningMove || draw;
      if (isWinningMove === true) {
        outcome = Outcome.PLAYER2_WINS;
        gridUtil.play(column, player);
      } else if (draw === true) {
        outcome = Outcome.DRAW;
      } else {
        gridUtil.play(column, player);
      }
      nextPlayer = Player.PLAYER1;
      columnAvailable = [];
      for (let i = 0; i < COLUMNS; i++) {
        columnAvailable.push(gridUtil.canPlay(i));
      }

      return {
        grid: gridUtil.newGrid,
        nextPlayer,
        movesLeft: state.movesLeft - 1,
        outcome,
        reset,
        columnAvailable
      };
    case ConnectActionTypes.ComputerMove:
      player = action.payload.player;
      column = action.payload.column;

      gridUtil.setGrid(state.grid);
      isWinningMove = gridUtil.isWinningMove(column, player);
      draw = gridUtil.isDraw();
      outcome = Outcome.DEFAULT;
      reset = isWinningMove || draw;
      if (isWinningMove === true) {
        outcome = Outcome.COMPUTER_WINS;
        gridUtil.play(column, player);
      } else if (draw === true) {
        outcome = Outcome.DRAW;
      } else {
        gridUtil.play(column, player);
      }
      nextPlayer = Player.PLAYER1;
      columnAvailable = [];
      for (let i = 0; i < COLUMNS; i++) {
        columnAvailable.push(gridUtil.canPlay(i));
      }

      return {
        grid: gridUtil.newGrid,
        nextPlayer: Player.PLAYER1,
        movesLeft: state.movesLeft - 1,
        outcome,
        reset,
        columnAvailable
      };
    default:
      return state;
  }
}
