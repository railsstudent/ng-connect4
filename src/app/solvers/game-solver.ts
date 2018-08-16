import { environment } from "../../environments/environment";
import { GridUtil } from "../util/grid.util";
import { Player, Pos, INF } from "../models";

export const MINI_MAX = "minimax";
export const ALPHA_BETA = "alphabeta";

export const DEPTH = environment.depth;
const evaluationTable = [
  [3, 4, 5, 7, 5, 4, 3],
  [4, 6, 8, 10, 8, 6, 4],
  [5, 8, 11, 13, 11, 8, 5],
  [5, 8, 11, 13, 11, 8, 5],
  [4, 6, 8, 10, 8, 6, 4],
  [3, 4, 5, 7, 5, 4, 3]
];

export const heuristicEvaluation = (gridUtil, player: string, { col }: Pos, sign) => {
  let score = 0;
  if (gridUtil.isWinningMove(col, player).win === true) {
    const row = gridUtil.height[col];
    console.log('line 1', `row: ${row}, col: ${col}, value: ${sign * INF}`);
    score = sign * INF;
  } else {
    const row = gridUtil.height[col];
    console.log('line 2', `row: ${row}, col: ${col}, height: ${gridUtil.height[col]}`);
    score = evaluationTable[row][col];
  }
  return score;
};

export interface GameSolver {
  bestScore(grid: string[]): number;
  bestMove(grid: string[]): Pos;
  setGridUtil(gridUtil: GridUtil);
  setMaximizePlayer(player: Player);
  setMinimizePlayer(player: Player);
}
