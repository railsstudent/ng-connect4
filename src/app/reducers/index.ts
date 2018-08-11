import { ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "../../environments/environment";

import { ConnectState, connectReducer } from "./connect.reducer";

export interface AppState {
  connect: ConnectState;
}

export const reducers: ActionReducerMap<AppState> = {
  connect: connectReducer
};

export function debug(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return function(state, action) {
    console.log("state", state);
    console.log("action", action);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [debug]
  : [];

export {
  selectConnect,
  selectColumnAvailable,
  selectGrid,
  selectMovesLeft,
  selectNextPlayer,
  selectOutcome,
  selectResetGame,
  selectWinningSequence
} from "./connect.reducer";
