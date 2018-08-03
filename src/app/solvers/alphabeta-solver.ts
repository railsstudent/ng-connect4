import { GameSolver, MoveState, Pos } from "./game-solver";
import { Player, ROWS, COLUMNS } from "../models";
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
  private gridUtil;
  private maximizePlayer;
  private minimizePlayer;

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

  // Generate a game tree and find the best score of the current move
  alphabeta(
    currentMove: Pos,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: boolean
  ): number {
    const newGrid = this.gridUtil.gridCopy;
    this.gridUtil.setGrid(newGrid);

    // terminate state of the game tree: a draw
    if (this.gridUtil.numMoves === ROWS * COLUMNS) {
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
    const nextStateGrid = this.gridUtil.gridCopy;

    // find the min value of all the max values of opposition
    let bestScore: number;
    if (maximizingPlayer === true) {
      bestScore = -ROWS * COLUMNS;
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
          console.log(
            "minimized next move",
            minScore,
            "alpha",
            alpha,
            "beta",
            beta,
            "move",
            move
          );
          if (minScore > bestScore) {
            bestScore = minScore;
          }
        }
      }
    } else {
      // minimizing player
      bestScore = ROWS * COLUMNS;
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
