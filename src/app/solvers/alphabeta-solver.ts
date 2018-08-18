import { GameSolver, DEPTH, heuristicEvaluation } from "./game-solver";
import { Player, INF } from "../models";
import { Board } from "../util/board";

export class AlphabetaSolver implements GameSolver {
  private maximizePlayer: Player;
  private minimizePlayer: Player;

  private hasHeuristicValue(board: Board, column: number, depth: number) {
    if (board.isDraw()) {
      return [null, 0];
    }

    // terminate state of the game tree: reach depth or player wins the game
    if (column != null && board.isWinningMove(column, this.maximizePlayer).win === true) {
      return [null, INF];
    }

    if (column != null && board.isWinningMove(column, this.minimizePlayer).win === true) {
      return [null, -INF];
    }

    if (depth === 0) {
      const score = heuristicEvaluation(board, column);
      return [null, score];
    }

    return null;
  }

  maximizePlay(board: Board, column: number, depth: number, alpha: number, beta: number) {
    const hValue = this.hasHeuristicValue(board, column, depth);
    if (hValue) {
      return hValue;
    }

    let max = [null, -INF];
    const childBoards = board.generateChildBoards(this.maximizePlayer);
    for (const cb of childBoards) {
      const { column: childColumn, board: childBoard } = cb;
      const nextMove = this.minimizePlay(childBoard, childColumn, depth - 1, alpha, beta);
      console.log("maximizePlay - ", "nextMove", nextMove);

      // Evaluate new move
      if (max[0] === null || nextMove[1] > max[1]) {
        max = [childColumn, nextMove[1]];
        alpha = nextMove[1];
        console.log(`update alpha, alpha ${alpha}, beta ${beta}, max ${max}`);
      }
      if (alpha >= beta) {
        console.log(`alpha cut', alpha ${alpha}, beta ${beta}, max ${max}`);
        return max;
      }
    }
    return max;
  }

  minimizePlay(board: Board, column: number, depth: number, alpha: number, beta: number) {
    const hValue = this.hasHeuristicValue(board, column, depth);
    if (hValue) {
      return hValue;
    }

    let min = [null, INF];
    const childBoards = board.generateChildBoards(this.minimizePlayer);
    for (const cb of childBoards) {
      const { column: childColumn, board: childBoard } = cb;
      const nextMove = this.maximizePlay(childBoard, childColumn, depth - 1, alpha, beta);
      console.log("minimizePlay - ", "nextMove", nextMove);

      // Evaluate new move
      if (min[0] === null || nextMove[1] < min[1]) {
        min = [childColumn, nextMove[1]];
        beta = nextMove[1];
        console.log(`update beta, alpha ${alpha}, beta ${beta}, min ${min}`);
      }
      if (alpha >= beta) {
        console.log(`beta cut', alpha ${alpha}, beta ${beta}, min ${min}`);
        return min;
      }
    }
    return min;
  }

  bestMove(board: Board): number {
    const aiMove = this.maximizePlay(board, null, DEPTH, -INF, INF);
    const column = aiMove[0];
    const score = aiMove[1];
    console.log(`----- AlphaBetaSolver bestMove: column: ${column}, score: ${score} ----`);
    return column;
  }

  setMaximizePlayer(player: Player) {
    this.maximizePlayer = player;
  }

  setMinimizePlayer(player: Player) {
    this.minimizePlayer = player;
  }
}
