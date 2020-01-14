import * as connectActions from "./connect.actions";
import { Action, createFeatureSelector, createSelector, createReducer, on } from "@ngrx/store";
import "es6-object-assign";
import { COLUMNS, ConnectModeMoveModel, Direction, Mode, MoveModel, Outcome, Player, Pos, ROWS } from "../models";
import { Board } from "../util/board";

export interface ConnectState {
  board: Board;
  nextPlayer: Player;
  outcome: Outcome;
  winningSequence: number[];
  direction: Direction;
  reset: boolean;
  columnAvailable: boolean[];
  mode: Mode;
  lastMove: Pos;
}

const initColumns = (value: boolean) => {
  const columns = [];
  for (let i = 0; i < COLUMNS; i++) {
    columns.push(value);
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
  columnAvailable: initColumns(true),
  mode: Mode.UNKNOWN,
  lastMove: null
};

const nextAction = (state: ConnectState, move: MoveModel | ConnectModeMoveModel): ConnectState => {
  const { player, column } = move;
  const mode = (move as ConnectModeMoveModel).mode ? (move as ConnectModeMoveModel).mode : Mode.UNKNOWN;

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
  let columnAvailable = [];
  if (reset === true) {
    columnAvailable = initColumns(false);
  } else {
    for (let i = 0; i < COLUMNS; i++) {
      columnAvailable.push(board.canPlay(i));
    }
  }
  const lastMove = {
    row: board.height[column] - 1,
    col: column
  };
  return {
    board,
    nextPlayer,
    outcome,
    winningSequence,
    direction,
    reset,
    columnAvailable,
    mode: state.mode,
    lastMove
  };
};

const connectReducer = createReducer(
  initialState,
  on(connectActions.NewGameAction, (_, { mode }) => Object.assign({}, initialState, { mode })),
  on(connectActions.PlayerOneMoveAction, (state, move) => nextAction(state, move)),
  on(connectActions.PlayerTwoMoveAction, (state, move) => nextAction(state, move)),
  on(connectActions.ComputerMoveAction, (state, move) => nextAction(state, move)),
  on(connectActions.ChooseModeAction, () => initialState)
);

export function reducer(state: ConnectState | undefined, action: Action) /* : ConnectState*/ {
  return connectReducer(state, action);
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
export const selectMode = createSelector(selectConnect, ({ mode }) => mode);
export const selectLastMove = createSelector(selectConnect, ({ lastMove }) => {
  if (lastMove) {
    const row = ROWS - lastMove.row - 1;
    const lastMoveIdx = lastMove ? row * COLUMNS + lastMove.col : null;
    return { lastMove, lastMoveIdx };
  }
  return { lastMove: null, lastMoveIdx: null };
});
