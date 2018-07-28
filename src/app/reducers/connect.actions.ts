import { Action } from '@ngrx/store';

export enum ConnectActionTypes {
  NewGame = '[Connect] New Game',
  Player1Move = '[Connect] Player 1\'s Move',
  Player2Move = '[Connect] Player 2\'s Move',
  ComputerMove = '[Connect] Computer\'s Move'
}

export class NewGame implements Action {
  readonly type = ConnectActionTypes.NewGame;
}

export type ConnectActions = NewGame;
