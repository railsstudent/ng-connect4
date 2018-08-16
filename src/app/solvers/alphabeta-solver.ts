import { GameSolver, heuristicEvaluation } from "./game-solver";
import { Player, COLUMNS, INF, Pos } from "../models";
import { GridUtil } from "../util/grid.util";
import { environment } from "../../environments/environment";

const DEPTH = environment.depth;

export class AlphabetaSolver implements GameSolver {
  private gridUtil: GridUtil;
  private maximizePlayer: Player;
  private minimizePlayer: Player;

  // Generate a game tree and find the best score of the current move
  alphabeta(currentMove: Pos, depth: number, alpha: number, beta: number, maximizingPlayer: boolean): number {

    const newGrid = this.gridUtil.newGrid;
    this.gridUtil.setGrid(newGrid);

    // terminate state of the game tree: a draw
    if (this.gridUtil.isDraw()) {
      return 0;
    }

    const player = maximizingPlayer ? this.maximizePlayer : this.minimizePlayer;
    console.log(`Pass [${currentMove.row}, ${currentMove.col}] to depth ${depth}, player is ${player}`);

    // terminate state of the game tree: reach depth or player wins the game
    if (depth === 0 ||
        (this.gridUtil.isWinningMove(currentMove.col, player).win === true)) {
      const x = heuristicEvaluation(this.gridUtil, player, currentMove, (maximizingPlayer ? 1 : -1));
      this.gridUtil.play(currentMove.col, player);
      console.log("depth: ", depth, "player's turn", player, ", score ", x, "move", currentMove, "\r\n", this.gridUtil.print());
      console.log(`[bestMove] [${currentMove.row}, ${currentMove.col}] placed ${player} depth: ${depth}:\r\n`, this.gridUtil.print());
      return x;
    }

    if (this.gridUtil.canPlay(currentMove.col)) {
      this.gridUtil.play(currentMove.col, player);
      console.log(`[bestMove] [${currentMove.row}, ${currentMove.col}] placed ${player} depth: ${depth}:\r\n`, this.gridUtil.print());
    }
    const nextStateGrid = this.gridUtil.newGrid;

    // find the min value of all the max values of opposition
    let bestScore: number;
    if (maximizingPlayer === true) {
      bestScore = -INF;
      for (let col = 0; col < COLUMNS; col++) {
        const maxmizeGrid = JSON.parse(JSON.stringify(nextStateGrid));
        this.gridUtil.setGrid(maxmizeGrid);
        // find opposite moves
        if (this.gridUtil.canPlay(col)) {
          const move = { row: this.gridUtil.height[col], col };
          const minScore = this.alphabeta(move, depth - 1, alpha, beta, false);
          // human wins
          // if (minScore === -INF) {
          //   console.log('break: minScore return', -minScore);
          //   return -minScore;
          // }
          bestScore = Math.max(bestScore, minScore);
          const oldAlpha = alpha;
          alpha = Math.max(alpha, bestScore);
          console.log("[maximized] depth: ", depth, "player's turn", player, ", next move's score", minScore,
            "bestScore", bestScore, "old alpha", oldAlpha, "alpha", alpha, "beta", beta, "move", move, "\r\n", this.gridUtil.print());
          if (alpha >= beta) {
            console.log("[Minimized] player's turn", player, "beta cutoff", "alpha", alpha, "beta", beta, "move", move);
            //break;
            return bestScore;
          }
        }
      }
    } else {
      // minimizing player
      bestScore = INF;
      for (let col = 0; col < COLUMNS; col++) {
        const minimizeGrid = JSON.parse(JSON.stringify(nextStateGrid));
        this.gridUtil.setGrid(minimizeGrid);
        // find opposite moves
        if (this.gridUtil.canPlay(col)) {
          const move = { row: this.gridUtil.height[col], col };
          const maxScore = this.alphabeta(move, depth - 1, alpha, beta, true);
          // computer wins
          // if (maxScore === INF) {
          //   console.log('break: maxScore return', -maxScore);
          //   return -maxScore;
          // }
          bestScore = Math.min(bestScore, maxScore);
          const oldBeta = beta;
          beta = Math.min(beta, bestScore);
          console.log("[minized] depth: ", depth, "player's turn", player, ", next move's score", maxScore, "bestScore",
            bestScore, "alpha", alpha, "old beta", oldBeta, "beta", beta, "move", move, "\r\n", this.gridUtil.print());
          if (alpha >= beta) {
            console.log("[Maximized] player's turn", player, "alpha cutoff", "alpha", alpha, "beta", beta, "move", move);
            return bestScore;
          }
        }
      }
    }
    return bestScore;
  }

  bestScore(grid): number {
    let bestScore = -INF;
    for (let col = 0; col < COLUMNS; col++) {
      if (this.gridUtil.canPlay(col)) {
        const newGrid = JSON.parse(JSON.stringify(grid));
        this.gridUtil.setGrid(newGrid);
        const currentMove = { row: this.gridUtil.height[col], col };
        const score = this.alphabeta(currentMove, DEPTH, -INF, INF, true);
        if (score >= bestScore) {
          bestScore = score;
        }
      }
    }
    console.log(`---- MinimaxSolver bestScore: ${bestScore} ----`);
    return bestScore;
  }

  bestMove(grid): Pos {
    let bestMove: Pos = null;
    let bestScore = -INF;
    for (let col = 0; col < COLUMNS; col++) {
      const newGrid = JSON.parse(JSON.stringify(grid));
      this.gridUtil.setGrid(newGrid);
      console.log("[BestMove] -- \r\n", this.gridUtil.print());
      if (this.gridUtil.canPlay(col)) {
        const currentMove = { row: this.gridUtil.height[col], col };
        const score = this.alphabeta(currentMove, DEPTH, -INF, INF, true);
        console.log(`[bestMove] Score of [${currentMove.row}, ${currentMove.col}] is ${score}, bestScore is ${bestScore}`);
        if (score >= bestScore) {
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
