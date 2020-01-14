import { ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "../../environments/environment";
import * as fromConnect from "./connect.reducer";

export interface AppState {
  connect: fromConnect.ConnectState;
}

export const reducers: ActionReducerMap<AppState> = {
  connect: fromConnect.reducer
};

export function debug(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function(state, action) {
    console.log("state", state);
    console.log("action", action);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [debug] : [];

export {
  selectConnect,
  selectColumnAvailable,
  selectGrid,
  selectMovesLeft,
  selectNextPlayer,
  selectOutcome,
  selectResetGame,
  selectWinningSequence,
  selectMode,
  selectLastMove
} from "./connect.reducer";
