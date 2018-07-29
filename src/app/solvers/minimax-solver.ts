import { GameSolver, Pos, MoveState } from "./game-solver";
import { GridUtil } from "../util/grid.util";
import { ROWS, COLUMNS } from "../models";

export interface BestMoveInfo {
  score: number;
  pos: Pos;
}

const DEPTH = 2;
const evaluationTable = [
  [3, 4, 5, 7, 5, 4, 3],
  [4, 6, 8, 10, 8, 6, 4],
  [5, 8, 11, 13, 11, 8, 5],
  [5, 8, 11, 13, 11, 8, 5],
  [4, 6, 8, 10, 8, 6, 4],
  [3, 4, 5, 7, 5, 4, 3]
];

export class MinimaxSolver implements GameSolver {
  private gridUtil; // = new GridUtil();

  gridCopy() {
    return this.gridUtil.grid;
  }

  setGridUtil(gridUtil: GridUtil) {
    this.gridUtil = gridUtil;
  }

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
  minimax(
    grid: string[],
    currentMove: Pos,
    player: string,
    otherPlayer: string,
    depth: number,
    maximizingPlayer: boolean
  ): number {
    const newGrid = JSON.parse(JSON.stringify(grid));
    this.gridUtil.setGrid(newGrid);

    // terminate state of the game tree: a draw
    if (this.gridUtil.numMoves === ROWS * COLUMNS) {
      return 0;
    }

    // terminate state of the game tree: reach depth or player wins the game
    if (depth === 0 || this.gridUtil.isWinningMove(currentMove.col, player)) {
      return this.heuristicEvaluation(player, currentMove);
    } else {
      if (this.gridUtil.canPlay(currentMove.col)) {
        this.gridUtil.play(currentMove.col, player);
      }
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
          const minScore = this.minimax(
            this.gridUtil.gridCopy,
            { row: this.gridUtil.height[col], col },
            otherPlayer,
            player,
            depth - 1,
            false
          );
          console.log("minimized next move", minScore);
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
          const maxScore = this.minimax(
            this.gridUtil.gridCopy,
            { row: this.gridUtil.height[col], col },
            otherPlayer,
            player,
            depth - 1,
            true
          );
          console.log("maximized next move", maxScore);
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

  bestScore({ grid, player, oppositePlayer }): number {
    let bestScore = -ROWS * COLUMNS;
    this.gridUtil.setGrid(grid);
    for (let col = 0; col < COLUMNS; col++) {
      if (this.gridUtil.canPlay(col)) {
        // const newGrid = this.gridUtil.play(col, player);
        const currentMove = { row: this.gridUtil.height[col], col };
        const score = this.minimax(
          grid,
          currentMove,
          oppositePlayer,
          player,
          DEPTH,
          true
        );
        if (score > bestScore) {
          bestScore = score;
        }
      }
    }
    console.log(`---- MinimaxSolver bestScore: ${bestScore} ----`);
    return bestScore;
  }

  bestMove({ grid, player, oppositePlayer }): Pos {
    let bestMove: Pos = null;
    let bestScore = -ROWS * COLUMNS;
    this.gridUtil.setGrid(grid);
    for (let col = 0; col < COLUMNS; col++) {
      if (this.gridUtil.canPlay(col)) {
        const currentMove = { row: this.gridUtil.height[col], col };
        const score = this.minimax(
          this.gridUtil.gridCopy,
          currentMove,
          oppositePlayer,
          player,
          DEPTH,
          true
        );
        if (score > bestScore) {
          bestScore = score;
          bestMove = currentMove;
        }
      }
    }
    console.log(`---- MinimaxSolver bestScore: ${bestScore} ----`);
    console.log(
      `----- MinimaxSolver bestMove: [${bestMove.row}, ${bestMove.col}] ----`
    );
    return bestMove;
  }
}
