import { GameSolver, MoveState, Pos } from "./game-solver";
import { Player } from "../models";
import { GridUtil } from "../util/grid.util";

export class AlphabetaSolver implements GameSolver {
  private gridUtil;
  private maximizePlayer;
  private minimizePlayer;

  // Generate a game tree and find the best score of the current move
  alphabeta(
    currentMove: Pos,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: boolean
  ): number {
    return 0;
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
