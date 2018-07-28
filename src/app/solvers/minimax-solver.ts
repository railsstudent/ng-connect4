import { GameSolver, Pos, MoveState } from "./game-solver";
import { GridUtil } from "../util/grid.util";
import { ROWS, COLUMNS } from "../models";

export interface BestMoveInfo {
  score: number;
  pos: {
    row: number;
    col: number;
  };
}

const DEPTH = 2;

export class MinimaxSolver implements GameSolver {
  private gridUtil = new GridUtil();

  private minimax(
    player: string,
    otherPlayer: string,
    depth: number,
    maximizingPlayer: boolean
  ): BestMoveInfo {
    // a draw
    if (this.gridUtil.numMoves === ROWS * COLUMNS) {
      return {
        score: 0,
        pos: { row: null, col: null }
      };
    }

    const factor = maximizingPlayer ? 1 : -1;
    // reach the cell at a given depth or a winning move
    for (let col = 0; col < COLUMNS; col++) {
      if (this.gridUtil.canPlay(col)) {
        if (depth === 0 || this.gridUtil.isWinningMove(col, player)) {
          return {
            score: factor * ((ROWS * COLUMNS + 1 - this.gridUtil.numMoves) / 2),
            pos: {
              row: this.gridUtil.height[col],
              col
            }
          };
        }
      }
    }

    // find the min value of all the max values of opposition
    let bestMove = {
      score: -factor * ROWS * COLUMNS,
      pos: null
    };
    if (maximizingPlayer === true) {
      for (let col = 0; col < COLUMNS; col++) {
        if (this.gridUtil.canPlay(col)) {
          this.gridUtil.play(col, player);
          const currentMove = this.minimax(
            otherPlayer,
            player,
            depth - 1,
            false
          );
          if (currentMove.score > bestMove.score) {
            bestMove = currentMove;
          }
        }
      }
    } else {
      // minimizing player
      for (let col = 0; col < COLUMNS; col++) {
        if (this.gridUtil.canPlay(col)) {
          this.gridUtil.play(col, player);
          const currentMove = this.minimax(
            otherPlayer,
            player,
            depth - 1,
            true
          );
          if (currentMove.score < bestMove.score) {
            bestMove = currentMove;
          }
        }
      }
    }
    return bestMove;
  }

  bestScore({ grid, player, oppositePlayer }): number {
    const cloneGrid = JSON.parse(JSON.stringify(grid));
    this.gridUtil.setGrid(cloneGrid);
    const { score } = this.minimax(player, oppositePlayer, DEPTH, true);
    console.log(`MinimaxSolver bestScore: ${score}`);
    return score;
  }

  bestMove({ grid, player, oppositePlayer }): Pos {
    const cloneGrid = JSON.parse(JSON.stringify(grid));
    this.gridUtil.setGrid(cloneGrid);
    const { pos } = this.minimax(player, oppositePlayer, DEPTH, true);
    const { row, col } = pos;
    console.log(`MinimaxSolver bestMove: [${row}, ${col}]`);
    return { row, col };
  }
}
