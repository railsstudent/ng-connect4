import { GameSolver, heuristicEvaluation } from "./game-solver";
import { Player, COLUMNS, MIN_INF, MAX_INF, Pos } from "../models";
import { GridUtil } from "../util/grid.util";
import { environment } from "../../environments/environment";

const DEPTH = environment.depth;

export class AlphabetaSolver implements GameSolver {
  private gridUtil: GridUtil;
  private maximizePlayer: Player;
  private minimizePlayer: Player;

  //   function alphabeta(node, depth, α, β, maximizingPlayer) is
  //     if depth = 0 or node is a terminal node then
  //         return the heuristic value of node
  //     if maximizingPlayer then
  //         value := −∞
  //         for each child of node do
  //             value := max(value, alphabeta(child, depth − 1, α, β, FALSE))
  //             α := max(α, value)
  //             if α ≥ β then
  //                 break (* β cut-off *)
  //         return value
  //     else
  //         value := +∞
  //         for each child of node do
  //             value := min(value, alphabeta(child, depth − 1, α, β, TRUE))
  //             β := min(β, value)
  //             if α ≥ β then
  //                 break (* α cut-off *)
  //         return value
  // (* Initial call *)
  // alphabeta(origin, depth, −∞, +∞, TRUE)

  // Generate a game tree and find the best score of the current move
  alphabeta(currentMove: Pos, depth: number, alpha: number, beta: number, maximizingPlayer: boolean): number {
    const newGrid = this.gridUtil.newGrid;
    this.gridUtil.setGrid(newGrid);

    // terminate state of the game tree: a draw
    if (this.gridUtil.isDraw()) {
      return 0;
    }

    const player = maximizingPlayer ? this.maximizePlayer : this.minimizePlayer;
    console.log("player's turn", player);

    // terminate state of the game tree: reach depth or player wins the game
    if (depth === 0) {
      return heuristicEvaluation(this.gridUtil, player, currentMove);
    } else if (this.gridUtil.isWinningMove(currentMove.col, player).win === true) {
      console.log(`Winning move for ${player} - [${currentMove.row}, ${currentMove.col}]`);
      return (maximizingPlayer ? 1 : -1) * 10000;
    }

    if (this.gridUtil.canPlay(currentMove.col)) {
      this.gridUtil.play(currentMove.col, player);
    }
    const nextStateGrid = this.gridUtil.newGrid;

    // find the min value of all the max values of opposition
    let bestScore: number;
    if (maximizingPlayer === true) {
      bestScore = MIN_INF;
      for (let col = 0; col < COLUMNS; col++) {
        const maxmizeGrid = JSON.parse(JSON.stringify(nextStateGrid));
        this.gridUtil.setGrid(maxmizeGrid);
        // find opposite moves
        if (this.gridUtil.canPlay(col)) {
          const move = { row: this.gridUtil.height[col], col };
          const minScore = this.alphabeta(move, depth - 1, alpha, beta, false);
          bestScore = Math.max(bestScore, minScore);
          alpha = Math.max(alpha, bestScore);
          console.log("minimized next move", minScore, "bestScore", bestScore, "alpha", alpha, "beta", beta, "move", move);
          if (alpha >= beta) {
            console.log("beta cutoff", "alpha", alpha, "beta", beta, "move", move);
            break;
          }
        }
      }
    } else {
      // minimizing player
      bestScore = MAX_INF;
      for (let col = 0; col < COLUMNS; col++) {
        const minimizeGrid = JSON.parse(JSON.stringify(nextStateGrid));
        this.gridUtil.setGrid(minimizeGrid);
        // find opposite moves
        if (this.gridUtil.canPlay(col)) {
          const move = { row: this.gridUtil.height[col], col };
          const maxScore = this.alphabeta(move, depth - 1, alpha, beta, true);
          bestScore = Math.min(bestScore, maxScore);
          beta = Math.min(beta, bestScore);
          console.log("maximized next move", maxScore, "bestScore", bestScore, "alpha", alpha, "beta", beta, "move", move);
          if (alpha >= beta) {
            console.log("alpha cutoff", "alpha", alpha, "beta", beta, "move", move);
            break;
          }
        }
      }
    }
    return bestScore;
  }

  bestScore(grid): number {
    let bestScore = MIN_INF;
    for (let col = 0; col < COLUMNS; col++) {
      if (this.gridUtil.canPlay(col)) {
        const newGrid = JSON.parse(JSON.stringify(grid));
        this.gridUtil.setGrid(newGrid);
        const currentMove = { row: this.gridUtil.height[col], col };
        const score = this.alphabeta(currentMove, DEPTH, MIN_INF, MAX_INF, true);
        if (score > bestScore) {
          bestScore = score;
        }
      }
    }
    console.log(`---- MinimaxSolver bestScore: ${bestScore} ----`);
    return bestScore;
  }

  bestMove(grid): Pos {
    let bestMove: Pos = null;
    let bestScore = MIN_INF;
    for (let col = 0; col < COLUMNS; col++) {
      const newGrid = JSON.parse(JSON.stringify(grid));
      this.gridUtil.setGrid(newGrid);
      if (this.gridUtil.canPlay(col)) {
        const currentMove = { row: this.gridUtil.height[col], col };
        const score = this.alphabeta(currentMove, DEPTH, MIN_INF, MAX_INF, true);
        console.log(`[bestMove] Score of ${currentMove} is ${score}`);
        if (score > bestScore) {
          bestScore = score;
          bestMove = currentMove;
        }
      }
    }
    console.log(`---- AlphaBetaSolver bestScore: ${bestScore} ----`);
    console.log(`----- AlphaBetaSolver bestMove: [${bestMove.row}, ${bestMove.col}] ----`);
    return bestMove;
  }

  setGridUtil(gridUtil: GridUtil) {
    this.gridUtil = gridUtil;
  }

  setMaximizePlayer(player: Player) {
    this.maximizePlayer = player;
  }
  setMinimizePlayer(player: Player) {
    this.minimizePlayer = player;
  }
}
