export interface GameSolver {
  setGrid(grid: string[]);
  bestScore(): number;
  bestMove(): [number, number];
}
