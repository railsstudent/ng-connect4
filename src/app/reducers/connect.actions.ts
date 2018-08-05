import { Action } from "@ngrx/store";
import { MoveModel, ConnectModeMoveModel } from "../models";

export enum ConnectActionTypes {
  NewGame = "[Connect] New Game",
  Player1Move = "[Connect] Player 1 Makes Move",
  Player2Move = "[Connect] Player 2 Makes Move",
  ComputerMove = "[Connect] Computer Makes Move"
}

export class NewGameAction implements Action {
  readonly type = ConnectActionTypes.NewGame;
}

export class PlayerOneMoveAction implements Action {
  readonly type = ConnectActionTypes.Player1Move;

  constructor(public payload: ConnectModeMoveModel) {}
}

export class PlayerTwoMoveAction implements Action {
  readonly type = ConnectActionTypes.Player2Move;

  constructor(public payload: MoveModel) {}
}

export class ComputerMoveAction implements Action {
  readonly type = ConnectActionTypes.ComputerMove;

  constructor(public payload: MoveModel) {}
}

export type ConnectActions =
  | NewGameAction
  | PlayerOneMoveAction
  | PlayerTwoMoveAction
  | ComputerMoveAction;
