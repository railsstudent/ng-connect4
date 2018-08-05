import { Mode, Player } from "./enum";

export interface Pos {
  row: number;
  col: number;
}

export interface MoveModel {
  player: Player;
  column: number;
}

export interface ConnectModeMoveModel extends MoveModel {
  mode: Mode;
}
