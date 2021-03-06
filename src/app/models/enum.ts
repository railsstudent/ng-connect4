export enum Player {
  PLAYER1 = "o",
  PLAYER2 = "x",
  COMPUTER = "c",
}

export enum Outcome {
  PLAYER1_WINS = "Player 1 wins!!!",
  PLAYER2_WINS = "Player 2 wins!!!",
  COMPUTER_WINS = "Computer wins!!!",
  DRAW = "Draw!!!",
  DEFAULT = "",
}

export enum Mode {
  UNKNOWN,
  HUMAN_VS_HUMAN,
  HUMAN_VS_COMPUTER,
}

export enum Direction {
  HORIZONTAL,
  VERTICAL,
  LEFT_DIAG,
  RIGHT_DIAG,
  NONE,
}

export enum PieceColor {
  RED = "red",
  YELLOW = "yellow",
  MAGENTA = "magenta",
}
