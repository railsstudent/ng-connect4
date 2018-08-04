import { GameSolver, DEPTH, heuristicEvaluation } from "./game-solver";
import { GridUtil } from "../util/grid.util";
import { COLUMNS, Player, MIN_INF, MAX_INF, Pos } from "../models";

export class MinimaxSolver implements GameSolver {
  private gridUtil: GridUtil;
  private maximizePlayer: Player;
  private minimizePlayer: Player;

  // Generate a game tree and find the best score of the current move
  minimax(currentMove: Pos, depth: number, maximizingPlayer: boolean): number {
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
      return heuristicEvaluation(this.gridUtil, player, currentMove);
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
          const minScore = this.minimax(
            { row: this.gridUtil.height[col], col },
            depth - 1,
            false
          );
          console.log("minimized next move", minScore);
          bestScore = Math.max(minScore, bestScore);
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
          const maxScore = this.minimax(
            { row: this.gridUtil.height[col], col },
            depth - 1,
            true
          );
          console.log("maximized next move", maxScore);
          bestScore = Math.min(bestScore, maxScore);
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

  bestScore(grid): number {
    let bestScore = MIN_INF;
    for (let col = 0; col < COLUMNS; col++) {
      if (this.gridUtil.canPlay(col)) {
        const newGrid = JSON.parse(JSON.stringify(grid));
        this.gridUtil.setGrid(newGrid);
        const currentMove = { row: this.gridUtil.height[col], col };
        const score = this.minimax(currentMove, DEPTH, true);
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
        const score = this.minimax(currentMove, DEPTH, true);
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
