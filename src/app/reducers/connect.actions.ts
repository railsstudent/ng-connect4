import { Action } from "@ngrx/store";
import { MoveModel, ConnectModeMoveModel, Mode } from "../models";

export enum ConnectActionTypes {
  NewGame = "[Connect] New Game",
  Player1Move = "[Connect] Player 1 Makes Move",
  Player2Move = "[Connect] Player 2 Makes Move",
  ComputerMove = "[Connect] Computer Makes Move",
  ChooseMode = "[Connect] Choose mode"
}

export class NewGameAction implements Action {
  readonly type = ConnectActionTypes.NewGame;

  constructor(public payload: { mode: Mode }) {}
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

export class ChooseModeAction implements Action {
  readonly type = ConnectActionTypes.ChooseMode;
}

export type ConnectActions =
  | NewGameAction
  | PlayerOneMoveAction
  | PlayerTwoMoveAction
  | ComputerMoveAction
  | ChooseModeAction;
