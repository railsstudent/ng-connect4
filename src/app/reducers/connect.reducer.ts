import { Action } from "@ngrx/store";
import { Player, Outcome, ROWS, COLUMNS, FREE_CELL } from "../models/";

export enum ConnectActionTypes {
  NewGame = "[Connect] New Game",
  Player1Move = "[Connect] Player 1 Makes Move",
  Player2Move = "[Connect] Player 2 Makes Move",
  ComputerMove = "[Connect] Computer Makes Move",
  Player1Wins = "[Connect] Player 1 Wins",
  Player2Wins = "[Connect] Player 2 Wins",
  ComputerWins = "[Connect] Computer Wins",
  Draw = "[Connect] Draw"
}

export class NewGameAction implements Action {
  readonly type = ConnectActionTypes.NewGame;
}

export class PlayerOneMoveAction implements Action {
  readonly type = ConnectActionTypes.Player1Move;

  constructor(public payload: any) {}
}

export type ConnectActions = NewGameAction | PlayerOneMoveAction;

export interface ConnectState {
  grid: string[];
  nextPlayer: Player;
  movesLeft: number;
  outcome: Outcome;
  reset: boolean;
}

const initBoard = () => {
  const grid = [];
  for (let i = 0; i < ROWS * COLUMNS; i++) {
    grid.push(FREE_CELL);
  }
  return grid;
};

export const initialState: ConnectState = {
  grid: initBoard(),
  nextPlayer: Player.PLAYER1,
  movesLeft: ROWS * COLUMNS,
  outcome: Outcome.DEFAULT,
  reset: false
};

export function connectReducer(
  state = initialState,
  action: Action
): ConnectState {
  switch (action.type) {
    default:
      return state;
  }
}
