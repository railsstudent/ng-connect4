import { createAction, props } from "@ngrx/store";
import { ConnectModeMoveModel, Mode, MoveModel } from "../models";

export const NewGameAction = createAction("[Connect] New Game", props<{ mode: Mode }>());
export const PlayerOneMoveAction = createAction("[Connect] Player 1 Makes Move", props<ConnectModeMoveModel>());
export const PlayerTwoMoveAction = createAction("[Connect] Player 2 Makes Move", props<MoveModel>());
export const ComputerMoveAction = createAction("[Connect] Computer Makes Move", props<MoveModel>());
export const ChooseModeAction = createAction("[Connect] Choose mode");
