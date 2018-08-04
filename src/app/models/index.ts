export { Player, Outcome, Mode } from "./connect.enum";
export const FREE_CELL = "-";
export const ROWS = 6;
export const COLUMNS = 7;
export const MIN_INF = -ROWS * COLUMNS;
export const MAX_INF = ROWS * COLUMNS;

export interface Pos {
  row: number;
  col: number;
}

export interface MoveModel {
  mode: Mode;
  player: Player;
}
