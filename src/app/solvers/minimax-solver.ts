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

export class MinimaxSolver implements GameSolver {
  private gridUtil = new GridUtil();

  private calulateMinMax(player: string, otherPlayer: string): BestMoveInfo {
    // a draw
    if (this.gridUtil.numMoves === ROWS * COLUMNS) {
      return {
        score: 0,
        pos: { row: null, col: null }
      };
    }

    // find a winning move
    for (let col = 0; col < COLUMNS; col++) {
      if (
        this.gridUtil.canPlay(col) &&
        this.gridUtil.isWinningMove(col, player)
      ) {
        return {
          score: (ROWS * COLUMNS + 1 - this.gridUtil.numMoves) / 2,
          pos: {
            row: this.gridUtil.height[col],
            col
          }
        };
      }
    }

    // find the min value of all the max values of opposition
    let bestMove = {
      score: -ROWS * COLUMNS,
      pos: {
        row: null,
        col: null
      }
    };
    for (let col = 0; col < COLUMNS; col++) {
      if (this.gridUtil.canPlay(col)) {
        this.gridUtil.play(col, otherPlayer);
        const currentMove = this.calulateMinMax(otherPlayer, player);
        if (currentMove.score > bestMove.score) {
          bestMove = currentMove;
        }
      }
    }
    return bestMove;
  }

  bestScore({ grid, player, oppositePlayer }): number {
    const cloneGrid = JSON.parse(JSON.stringify(grid));
    this.gridUtil.setGrid(cloneGrid);
    const { score } = this.calulateMinMax(player, oppositePlayer);
    console.log(`MinimaxSolver bestScore: ${score}`);
    return score;
  }

  bestMove({ grid, player, oppositePlayer }): Pos {
    const cloneGrid = JSON.parse(JSON.stringify(grid));
    this.gridUtil.setGrid(cloneGrid);
    const { pos } = this.calulateMinMax(player, oppositePlayer);
    const { row, col } = pos;
    console.log(`MinimaxSolver bestMove: [${row}, ${col}]`);
    return { row, col };
  }
}
