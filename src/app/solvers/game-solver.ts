import { environment } from "../../environments/environment";
import { Board } from "../util/board";
import { Player, ROWS, COLUMNS, Pos } from "../models";

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

export const heuristicEvaluation = (board: Board, player: string, { col }: Pos) => {
  let score = 0;
  if (board.isWinningMove(col, player).win === true) {
    score = (ROWS * COLUMNS + 1 - board.numMoves) / 2;
  } else {
    const row = board.height[col];
    score = evaluationTable[row][col];
  }
  return score;
};

export interface GameSolver {
  bestScore(grid: string[]): number;
  bestMove(grid: string[]): Pos;
  setGridUtil(gridUtil: Board);
  setMaximizePlayer(player: Player);
  setMinimizePlayer(player: Player);
}
