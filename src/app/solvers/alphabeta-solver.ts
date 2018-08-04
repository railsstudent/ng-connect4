import { GameSolver, Pos } from "./game-solver";
import { Player, ROWS, COLUMNS, MIN_INF, MAX_INF } from "../models";
import { GridUtil } from "../util/grid.util";
import { environment } from "../../environments/environment";

const DEPTH = environment.depth;
const evaluationTable = [
  [3, 4, 5, 7, 5, 4, 3],
  [4, 6, 8, 10, 8, 6, 4],
  [5, 8, 11, 13, 11, 8, 5],
  [5, 8, 11, 13, 11, 8, 5],
  [4, 6, 8, 10, 8, 6, 4],
  [3, 4, 5, 7, 5, 4, 3]
];

export class AlphabetaSolver implements GameSolver {
  private gridUtil: GridUtil;
  private maximizePlayer: Player;
  private minimizePlayer: Player;

  heuristicEvaluation(player: string, { col }: Pos) {
    let score = 0;
    if (this.gridUtil.isWinningMove(col, player)) {
      score = (ROWS * COLUMNS + 1 - this.gridUtil.numMoves) / 2;
    } else {
      const row = ROWS - this.gridUtil.height[col] - 1;
      score = evaluationTable[row][col];
    }
    return score;
  }

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
  alphabeta(
    currentMove: Pos,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: boolean
  ): number {
    const newGrid = this.gridUtil.newGrid;
    this.gridUtil.setGrid(newGrid);

    // terminate state of the game tree: a draw
    if (this.gridUtil.isDraw()) {
      return 0;
    }

    const player = maximizingPlayer ? this.maximizePlayer : this.minimizePlayer;
    console.log("player's turn", player);

    // terminate state of the game tree: reach depth or player wins the game
    if (depth === 0 || this.gridUtil.isWinningMove(currentMove.col, player)) {
      return this.heuristicEvaluation(player, currentMove);
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
          const minScore = this.alphabeta(
            { row: this.gridUtil.height[col], col },
            depth - 1,
            alpha,
            beta,
            false
          );
          bestScore = Math.max(bestScore, minScore);
          alpha = Math.max(alpha, bestScore);
          console.log(
            "minimized next move",
            minScore,
            "alpha",
            alpha,
            "beta",
            beta,
            "move",
            { row: this.gridUtil.height[col], col }
          );
          if (alpha >= beta) {
            console.log("beta cutoff", "alpha", alpha, "beta", beta, "move", {
              row: this.gridUtil.height[col],
              col
            });
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
          console.log(
            "maximized next move",
            maxScore,
            "alpha",
            alpha,
            "beta",
            beta,
            "move",
            move
          );
          if (maxScore < bestScore) {
            bestScore = maxScore;
          }
        }
      }
    }
    console.log(
      `row: ${currentMove.row}, col: ${
        currentMove.col
      }, bestScore: ${bestScore}`
    );
    return bestScore;
  }

  bestScore({ grid }): number {
    return 0;
  }

  bestMove({ grid }): Pos {
    return null;
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
