import { Action } from '@ngrx/store';
import { Player, Outcome } from '../models/connect.enum';
import { ConnectActionTypes, ConnectActions } from './connect.actions';

export interface ConnectState {
  grid: number[],
  currentPlayer: Player,
  outcome: Outcome
}

export const initialState: ConnectState = {
  grid: null,
  currentPlayer: Player.PLAYER1,
  outcome: Outcome.NEW_GAME
};

export function connectReducer(state = initialState, action: Action): ConnectState {
  switch (action.type) {

    default:
      return state;
  }
}
