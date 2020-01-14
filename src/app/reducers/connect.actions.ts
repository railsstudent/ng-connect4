import { createAction, props } from "@ngrx/store";
import { ConnectModeMoveModel, Mode, MoveModel } from "../models";

export enum ConnectActionTypes {
  NewGame = "[Connect] New Game",
  Player1Move = "[Connect] Player 1 Makes Move",
  Player2Move = "[Connect] Player 2 Makes Move",
  ComputerMove = "[Connect] Computer Makes Move",
  ChooseMode = "[Connect] Choose mode"
}

export const NewGameAction = createAction(ConnectActionTypes.NewGame, props<{ mode: Mode }>());
export const PlayerOneMoveAction = createAction(ConnectActionTypes.Player1Move, props<ConnectModeMoveModel>());
export const PlayerTwoMoveAction = createAction(ConnectActionTypes.Player2Move, props<MoveModel>());
export const ComputerMoveAction = createAction(ConnectActionTypes.ComputerMove, props<MoveModel>());
export const ChooseModeAction = createAction(ConnectActionTypes.ChooseMode);
