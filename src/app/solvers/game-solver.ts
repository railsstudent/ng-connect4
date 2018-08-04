import { environment } from "../../environments/environment";
import { GridUtil } from "../util/grid.util";
import { Player, ROWS, COLUMNS } from "../models";

export interface Pos {
  row: number;
  col: number;
}

export interface MoveState {
  grid: string[];
}

export const DEPTH = environment.depth;
const evaluationTable = [
  [3, 4, 5, 7, 5, 4, 3],
  [4, 6, 8, 10, 8, 6, 4],
  [5, 8, 11, 13, 11, 8, 5],
  [5, 8, 11, 13, 11, 8, 5],
  [4, 6, 8, 10, 8, 6, 4],
  [3, 4, 5, 7, 5, 4, 3]
];

export const heuristicEvaluation = (gridUtil, player: string, { col }: Pos) => {
  let score = 0;
  if (gridUtil.isWinningMove(col, player)) {
    score = (ROWS * COLUMNS + 1 - gridUtil.numMoves) / 2;
  } else {
    const row = ROWS - gridUtil.height[col] - 1;
    score = evaluationTable[row][col];
  }
  return score;
};

export interface GameSolver {
  bestScore(moveState: MoveState): number;
  bestMove(moveState: MoveState): Pos;
  setGridUtil(gridUtil: GridUtil);
  setMaximizePlayer(player: Player);
  setMinimizePlayer(player: Player);
}
