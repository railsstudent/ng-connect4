import { environment } from "../../environments/environment";
import { Board } from "../util/board";
import { Player, ROWS } from "../models";

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

export const heuristicEvaluation = (board: Board, column: number) => {
  let score = 0;
  const row = ROWS - board.height[column];
  score = evaluationTable[row][column];
  return score;
};

export interface GameSolver {
  bestMove(board: Board): number;
  setMaximizePlayer(player: Player);
  setMinimizePlayer(player: Player);
}
