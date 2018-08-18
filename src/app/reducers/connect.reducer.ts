import { ConnectActionTypes, ConnectActions } from "./connect.actions";
import { Player, Outcome, COLUMNS, Mode, Direction } from "../models";
import { Board } from "../util/board";
import { createSelector, createFeatureSelector } from "@ngrx/store";
import "es6-object-assign";

export interface ConnectState {
  board: Board;
  nextPlayer: Player;
  outcome: Outcome;
  winningSequence: number[];
  direction: Direction;
  reset: boolean;
  columnAvailable: boolean[];
  mode: Mode;
}

const initColumns = () => {
  const columns = [];
  for (let i = 0; i < COLUMNS; i++) {
    columns.push(true);
  }
  return columns;
};

export const initialState: ConnectState = {
  board: new Board(),
  nextPlayer: Player.PLAYER1,
  outcome: Outcome.DEFAULT,
  winningSequence: null,
  direction: null,
  reset: false,
  columnAvailable: initColumns(),
  mode: Mode.UNKNOWN
};

const nextAction = (state: ConnectState, action): ConnectState => {
  const { mode = Mode.UNKNOWN, player, column } = action.payload;
  const board = new Board();
  board.clone(state.board.newGrid);
  board.play(column, player);
  const winning = board.isWinningMove(column, player);
  const { win, direction, sequence: winningSequence } = winning;
  const draw = board.isDraw();
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
  if (reset === true) {
    for (let i = 0; i < COLUMNS; i++) {
      columnAvailable.push(false);
    }
  } else {
    for (let i = 0; i < COLUMNS; i++) {
      columnAvailable.push(board.canPlay(i));
    }
  }
  return {
    board,
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
  switch (action.type) {
    case ConnectActionTypes.Player1Move:
    case ConnectActionTypes.Player2Move:
    case ConnectActionTypes.ComputerMove:
      return nextAction(state, action);
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
export const selectGrid = createSelector(selectConnect, ({ board, reset, nextPlayer }) => ({
  board,
  reset,
  nextPlayer
}));
export const selectNextPlayer = createSelector(selectConnect, ({ nextPlayer }) => ({
  nextPlayer
}));
export const selectMovesLeft = createSelector(selectGrid, ({ board }) => board.remainingMoves);
export const selectOutcome = createSelector(selectConnect, ({ outcome }) => outcome);
export const selectColumnAvailable = createSelector(selectConnect, ({ columnAvailable }) => columnAvailable);
export const selectResetGame = createSelector(selectConnect, ({ reset }) => reset);
export const selectWinningSequence = createSelector(
  selectConnect,
  ({ outcome, direction, winningSequence: sequence }) => {
    let winner: Player;
    if (outcome === Outcome.PLAYER1_WINS) {
      winner = Player.PLAYER1;
    } else if (outcome === Outcome.PLAYER2_WINS) {
      winner = Player.PLAYER2;
    } else if (outcome === Outcome.COMPUTER_WINS) {
      winner = Player.COMPUTER;
    } else {
      winner = null;
    }
    return {
      direction,
      sequence,
      winner
    };
  }
);
export const selectMode = createSelector(selectConnect, (state: ConnectState) => state.mode);
