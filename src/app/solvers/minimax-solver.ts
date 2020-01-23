import { GameSolver, DEPTH, heuristicEvaluation } from "./game-solver";
import { Board } from "../util/board";
import { Player, INF } from "../models";

export class MinimaxSolver implements GameSolver {
  private maximizePlayer: Player;
  private minimizePlayer: Player;

  private hasHeuristicValue(board: Board, column: number, depth: number) {
    if (board.isDraw()) {
      return [-INF, 0];
    }

    // terminate state of the game tree: reach depth or player wins the game
    if (column != null && board.isWinningMove(column, this.maximizePlayer).win === true) {
      return [-INF, INF];
    }

    if (column != null && board.isWinningMove(column, this.minimizePlayer).win === true) {
      return [-INF, -INF];
    }

    if (depth === 0) {
      const score = heuristicEvaluation(board, column);
      return [-INF, score];
    }

    return null;
  }

  maximizePlay(board: Board, column: number, depth: number): number[] {
    const hValue = this.hasHeuristicValue(board, column, depth);
    if (hValue) {
      return hValue;
    }

    let max = [-INF, -INF];
    const childBoards = board.generateChildBoards(this.maximizePlayer);
    for (const cb of childBoards) {
      const { column: childColumn, board: childBoard } = cb;
      const nextMove = this.minimizePlay(childBoard, childColumn, depth - 1);
      console.log("maximizePlay - ", "nextMove", nextMove);

      // Evaluate new move
      if (max[0] === -INF || nextMove[1] > max[1]) {
        max = [childColumn, nextMove[1]];
      }
    }
    return max;
  }

  minimizePlay(board: Board, column: number, depth: number): number[] {
    const hValue = this.hasHeuristicValue(board, column, depth);
    if (hValue) {
      return hValue;
    }

    let min = [-INF, INF];
    const childBoards = board.generateChildBoards(this.minimizePlayer);
    for (const cb of childBoards) {
      const { column: childColumn, board: childBoard } = cb;
      const nextMove = this.maximizePlay(childBoard, childColumn, depth - 1);
      console.log("minimizePlay - ", "nextMove", nextMove);

      // Evaluate new move
      if (min[0] === -INF || nextMove[1] < min[1]) {
        min = [childColumn, nextMove[1]];
      }
    }
    return min;
  }

  bestMove(board: Board): number {
    const aiMove = this.maximizePlay(board, -INF, DEPTH);
    const column = aiMove[0];
    const score = aiMove[1];
    console.log(`----- MinimaxSolver bestMove: column: ${column}, score: ${score} ----`);
    return column;
  }

  setMaximizePlayer(player: Player) {
    this.maximizePlayer = player;
  }

  setMinimizePlayer(player: Player) {
    this.minimizePlayer = player;
  }
}
