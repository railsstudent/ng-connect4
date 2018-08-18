import { GameSolver } from "./game-solver";
import { Player, Pos } from "../models";
import { Board } from "../util/board";
// import { environment } from "../../environments/environment";

// const DEPTH = environment.depth;

export class AlphabetaSolver implements GameSolver {
  // private maximizePlayer: Player;
  // private minimizePlayer: Player;

  maximizePlay(board: Board, column: number, depth: number, alpha: number, beta: number) {
    // terminate state of the game tree: a draw
    if (board.isDraw()) {
      return [null, 0];
    }

    // // terminate state of the game tree: reach depth or player wins the game
    // if (depth === 0) {
    //   return heuristicEvaluation(board, this.maximizePlayer, currentMove);
    // } else if (this.board.isWinningMove(currentMove.col, player).win === true) {
    //   console.log(`Winning move for ${player} - [${currentMove.row}, ${currentMove.col}]`);
    //   return (maximizingPlayer ? 1 : -1) * 10000;
    // }
    return null;
  }

  // Generate a game tree and find the best score of the current move
  alphabeta(currentMove: Pos, depth: number, alpha: number, beta: number, maximizingPlayer: boolean): number {
    // const newGrid = this.board.newGrid;
    // this.board.clone(newGrid);

    // // terminate state of the game tree: a draw
    // if (this.board.isDraw()) {
    //   return 0;
    // }

    // const player = maximizingPlayer ? this.maximizePlayer : this.minimizePlayer;
    // console.log("player's turn", player);

    // // terminate state of the game tree: reach depth or player wins the game
    // if (depth === 0) {
    //   return heuristicEvaluation(this.board, player, currentMove);
    // } else if (this.board.isWinningMove(currentMove.col, player).win === true) {
    //   console.log(`Winning move for ${player} - [${currentMove.row}, ${currentMove.col}]`);
    //   return (maximizingPlayer ? 1 : -1) * 10000;
    // }

    // if (this.board.canPlay(currentMove.col)) {
    //   this.board.play(currentMove.col, player);
    // }
    // const nextStateGrid = this.board.newGrid;

    // // find the min value of all the max values of opposition
    // let bestScore: number;
    // if (maximizingPlayer === true) {
    //   bestScore = -INF;
    //   for (let col = 0; col < COLUMNS; col++) {
    //     const maxmizeGrid = JSON.parse(JSON.stringify(nextStateGrid));
    //     this.board.clone(maxmizeGrid);
    //     // find opposite moves
    //     if (this.board.canPlay(col)) {
    //       const move = { row: this.board.height[col], col };
    //       const minScore = this.alphabeta(move, depth - 1, alpha, beta, false);
    //       bestScore = Math.max(bestScore, minScore);
    //       alpha = Math.max(alpha, bestScore);
    //       console.log(
    //         "minimized next move",
    //         minScore,
    //         "bestScore",
    //         bestScore,
    //         "alpha",
    //         alpha,
    //         "beta",
    //         beta,
    //         "move",
    //         move
    //       );
    //       if (alpha >= beta) {
    //         console.log("beta cutoff", "alpha", alpha, "beta", beta, "move", move);
    //         break;
    //       }
    //     }
    //   }
    // } else {
    //   // minimizing player
    //   bestScore = INF;
    //   for (let col = 0; col < COLUMNS; col++) {
    //     const minimizeGrid = JSON.parse(JSON.stringify(nextStateGrid));
    //     this.board.clone(minimizeGrid);
    //     // find opposite moves
    //     if (this.board.canPlay(col)) {
    //       const move = { row: this.board.height[col], col };
    //       const maxScore = this.alphabeta(move, depth - 1, alpha, beta, true);
    //       bestScore = Math.min(bestScore, maxScore);
    //       beta = Math.min(beta, bestScore);
    //       console.log(
    //         "maximized next move",
    //         maxScore,
    //         "bestScore",
    //         bestScore,
    //         "alpha",
    //         alpha,
    //         "beta",
    //         beta,
    //         "move",
    //         move
    //       );
    //       if (alpha >= beta) {
    //         console.log("alpha cutoff", "alpha", alpha, "beta", beta, "move", move);
    //         break;
    //       }
    //     }
    //   }
    // }
    // return bestScore;
    return 0;
  }

  // bestScore(grid): number {
  //   let bestScore = -INF;
  //   for (let col = 0; col < COLUMNS; col++) {
  //     if (this.board.canPlay(col)) {
  //       const newGrid = JSON.parse(JSON.stringify(grid));
  //       this.board.clone(newGrid);
  //       const currentMove = { row: this.board.height[col], col };
  //       const score = this.alphabeta(currentMove, DEPTH, -INF, INF, true);
  //       if (score > bestScore) {
  //         bestScore = score;
  //       }
  //     }
  //   }
  //   console.log(`---- MinimaxSolver bestScore: ${bestScore} ----`);
  //   return bestScore;
  // }

  bestMove(board: Board): number {
    // let bestMove = 0;
    // let bestScore = -INF;
    // for (let col = 0; col < COLUMNS; col++) {
    //   const newGrid = JSON.parse(JSON.stringify(grid));
    //   this.board.clone(newGrid);
    //   if (this.board.canPlay(col)) {
    //     const currentMove = { row: this.board.height[col], col };
    //     const score = this.alphabeta(currentMove, DEPTH, -INF, INF, true);
    //     console.log(`[bestMove] Score of ${currentMove} is ${score}`);
    //     if (score > bestScore) {
    //       bestScore = score;
    //       bestMove = currentMove;
    //     }
    //   }
    // }
    // console.log(`---- AlphaBetaSolver bestScore: ${bestScore} ----`);
    // console.log(`----- AlphaBetaSolver bestMove: [${bestMove.row}, ${bestMove.col}] ----`);
    return 0;
  }

  // setGridUtil(gridUtil: Board) {
  //   this.board = gridUtil;
  // }

  setMaximizePlayer(player: Player) {
    // this.maximizePlayer = player;
  }
  setMinimizePlayer(player: Player) {
    // this.minimizePlayer = player;
  }
}
