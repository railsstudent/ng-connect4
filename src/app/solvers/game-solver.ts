export interface Pos {
  row: number;
  col: number;
}

export interface MoveState {
  grid: string[],
  player: string,
  oppositePlayer, string
}

export interface GameSolver {
  bestScore(moveState: MoveState): number;
  bestMove(move: MoveState): Pos;
}
