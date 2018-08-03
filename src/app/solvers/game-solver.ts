import { GridUtil } from "../util/grid.util";
import { Player } from "../models";

export interface Pos {
  row: number;
  col: number;
}

export interface MoveState {
  grid: string[];
}

export interface GameSolver {
  bestScore(moveState: MoveState): number;
  bestMove(moveState: MoveState): Pos;
  setGridUtil(gridUtil: GridUtil);
  setMaximizePlayer(player: Player);
  setMinimizePlayer(player: Player);
}
