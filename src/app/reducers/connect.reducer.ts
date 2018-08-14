import { ConnectActionTypes, ConnectActions } from "./connect.actions";
import { Player, Outcome, ROWS, COLUMNS, FREE_CELL, Mode, Direction } from "../models";
import { GridUtil } from "../util/grid.util";
import { createSelector, createFeatureSelector } from "@ngrx/store";
import "es6-object-assign";

export interface ConnectState {
  grid: string[];
  nextPlayer: Player;
  outcome: Outcome;
  winningSequence: number[];
  direction: Direction;
  reset: boolean;
  columnAvailable: boolean[];
  mode: Mode;
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
  outcome: Outcome.DEFAULT,
  winningSequence: null,
  direction: null,
  reset: false,
  columnAvailable: initColumns(),
  mode: Mode.UNKNOWN
};

const nextAction = (state: ConnectState, action, gridUtil: GridUtil): ConnectState => {
  const { mode = Mode.UNKNOWN, player, column } = action.payload;
  gridUtil.setGrid(state.grid);
  const winning = gridUtil.isWinningMove(column, player);
  const { win, direction, sequence: winningSequence } = winning;
  gridUtil.play(column, player);
  const draw = gridUtil.isDraw();
  let outcome = Outcome.DEFAULT;
  if (player === Player.PLAYER1 && win === true) {
    outcome = Outcome.PLAYER1_WINS;
  } else if (player === Player.PLAYER2 && win === true) {
    outcome = Outcome.PLAYER2_WINS;
  } else if (player === Player.COMPUTER && win === true) {
    outcome = Outcome.COMPUTER_WINS;
  } else if (draw === true) {
    outcome = Outcome.DRAW;
  }
  const reset = win || draw;
  let nextPlayer = Player.PLAYER1;
  if (player === Player.PLAYER1) {
    nextPlayer = mode === Mode.HUMAN_VS_HUMAN ? Player.PLAYER2 : Player.COMPUTER;
  } else if (player === Player.PLAYER2 || player === Player.COMPUTER) {
    nextPlayer = Player.PLAYER1;
  }
  const columnAvailable = [];
  if (nextPlayer === Player.COMPUTER || reset === true) {
    for (let i = 0; i < COLUMNS; i++) {
      columnAvailable.push(false);
    }
  } else {
    for (let i = 0; i < COLUMNS; i++) {
      columnAvailable.push(gridUtil.canPlay(i));
    }
  }
  return {
    grid: gridUtil.newGrid,
    nextPlayer,
    outcome,
    winningSequence,
    direction,
    reset,
    columnAvailable,
    mode: state.mode
  };
};

export function connectReducer(state = initialState, action: ConnectActions): ConnectState {
  const gridUtil = new GridUtil();

  switch (action.type) {
    case ConnectActionTypes.Player1Move:
    case ConnectActionTypes.Player2Move:
    case ConnectActionTypes.ComputerMove:
      return nextAction(state, action, gridUtil);
    case ConnectActionTypes.NewGame:
      const { mode } = action.payload;
      return Object.assign({}, initialState, { mode });
    case ConnectActionTypes.ChooseMode:
      return initialState;
    default:
      return state;
  }
}

// connect selector
export const selectConnect = createFeatureSelector<ConnectState>("connect");
export const selectGrid = createSelector(selectConnect, (state: ConnectState) => ({
  grid: state.grid,
  reset: state.reset,
  nextPlayer: state.nextPlayer
}));
export const selectNextPlayer = createSelector(selectConnect, (state: ConnectState) => ({
  nextPlayer: state.nextPlayer
}));
export const selectMovesLeft = createSelector(selectGrid, ({ grid }) => grid.filter(g => g === FREE_CELL).length);
export const selectOutcome = createSelector(selectConnect, (state: ConnectState) => state.outcome);
export const selectColumnAvailable = createSelector(selectConnect, (state: ConnectState) => state.columnAvailable);
export const selectResetGame = createSelector(selectConnect, (state: ConnectState) => state.reset);
export const selectWinningSequence = createSelector(selectConnect, (state: ConnectState) => {
  let winner: Player;
  if (state.outcome === Outcome.PLAYER1_WINS) {
    winner = Player.PLAYER1;
  } else if (state.outcome === Outcome.PLAYER2_WINS) {
    winner = Player.PLAYER2;
  } else if (state.outcome === Outcome.COMPUTER_WINS) {
    winner = Player.COMPUTER;
  } else {
    winner = null;
  }
  return {
    direction: state.direction,
    sequence: state.winningSequence,
    winner
  };
});
export const selectMode = createSelector(selectConnect, (state: ConnectState) => state.mode);
