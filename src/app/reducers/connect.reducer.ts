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

const nextAction = (state, action, gridUtil) => {
  const { mode = Mode.UNKNOWN, player, column } = action.payload;
  gridUtil.setGrid(state.grid);
  const isWinningMove = gridUtil.isWinningMove(column, player);
  gridUtil.play(column, player);
  const draw = gridUtil.isDraw();
  let outcome = Outcome.DEFAULT;
  if (player === Player.PLAYER1 && isWinningMove === true) {
    outcome = Outcome.PLAYER1_WINS;
  } else if (player === Player.PLAYER2 && isWinningMove === true) {
    outcome = Outcome.PLAYER2_WINS;
  } else if (player === Player.COMPUTER && isWinningMove === true) {
    outcome = Outcome.COMPUTER_WINS;
  } else if (draw === true) {
    outcome = Outcome.DRAW;
  }
  const reset = isWinningMove || draw;
  let nextPlayer = Player.PLAYER1;
  if (player === Player.PLAYER1) {
    nextPlayer =
      mode === Mode.HUMAN_VS_HUMAN ? Player.PLAYER2 : Player.COMPUTER;
  } else if (player === Player.PLAYER2 || player === Player.COMPUTER) {
    nextPlayer = Player.PLAYER1;
  }
  const columnAvailable = [];
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
};

export function connectReducer(
  state = initialState,
  action: ConnectActions
): ConnectState {
  const gridUtil = new GridUtil();

  switch (action.type) {
    case ConnectActionTypes.Player1Move:
    case ConnectActionTypes.Player2Move:
    case ConnectActionTypes.ComputerMove:
      return nextAction(state, action, gridUtil);
    default:
      return state;
  }
}
