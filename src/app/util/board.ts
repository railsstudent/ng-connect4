import { FREE_CELL, ROWS, COLUMNS, Player, ConnectSequence, Direction } from "../models";
import { environment } from "../../environments/environment";

const winning_points = environment.winningPieces;

export interface ChildBoard {
  column: number;
  board: Board;
}

export class Board {
  private _grid: string[] = [];
  private _height: number[] = [];

  constructor(grid?: string[]) {
    if (grid) {
      this.clone(grid);
    } else {
      this._grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        this._grid.push(FREE_CELL);
      }
      for (let i = 0; i < COLUMNS; i++) {
        this._height.push(0);
      }
    }
  }

  clone(grid: string[]) {
    const convertIdxToRowCol = (idx: number) => {
      const col = idx % COLUMNS;
      const row = (idx - col) / ROWS;
      return { row, col };
    };

    this._grid = [];
    this._height = [];
    for (let i = 0; i < COLUMNS; i++) {
      this._height.push(0);
    }
    for (let i = 0; i < grid.length; i++) {
      const { col } = convertIdxToRowCol(i);
      this._grid.push(grid[i]);
      if (grid[i] !== FREE_CELL) {
        this._height[col]++;
      }
    }
  }

  private convertRowColToIdx(row: number, col: number) {
    if (row >= 0 && row < ROWS && col >= 0 && col < COLUMNS) {
      return row * COLUMNS + col;
    }
    return -1;
  }

  canPlay(column: number): boolean {
    if (column < 0 || column >= COLUMNS) {
      return false;
    }
    return this._height[column] < ROWS;
  }

  // Determins whether player wins the game if he inserts a new piece at column
  isWinningMove(column: number, player: Player): ConnectSequence {
    const sortMoves = (a: number, b: number) => a - b;

    // check vertical
    if (this.height[column] >= winning_points) {
      const idxs = [];
      for (let i = 1; i <= winning_points; i++) {
        idxs.push(this.convertRowColToIdx(this.height[column] - i, column));
      }
      if (idxs.every(idx => this._grid[idx] === player)) {
        return {
          win: true,
          direction: Direction.VERTICAL,
          sequence: idxs.sort(sortMoves),
        };
      }
    }

    // check horizontal, left diagonally and right diagonally
    let pieces = 0;
    const height = this._height[column] - 1;
    // 0 is horizontal checking, -1 is left-diagonally checking, 1 is right-diagonally
    for (let direction = -1; direction <= 1; direction++) {
      for (let x = winning_points - 1; x >= 0; x--) {
        pieces = 0;
        const sequence = [];
        for (let delta = -(winning_points - 1); delta <= 0; delta++) {
          const colIdx = column + delta + x;
          const rowIdx = height + direction * (delta + x);
          if (colIdx >= 0 && colIdx < COLUMNS && rowIdx >= 0 && rowIdx < ROWS) {
            const idx = this.convertRowColToIdx(rowIdx, colIdx);
            sequence.push(idx);
            if (idx >= 0 && idx < ROWS * COLUMNS && this._grid[idx] === player) {
              pieces += 1;
            } else {
              break;
            }
          }
        }
        if (pieces === winning_points) {
          let sequenceDirection = Direction.NONE;
          if (direction === 0) {
            sequenceDirection = Direction.HORIZONTAL;
          } else if (direction === -1) {
            sequenceDirection = Direction.LEFT_DIAG;
          } else if (direction === 1) {
            sequenceDirection = Direction.RIGHT_DIAG;
          }
          return {
            win: true,
            direction: sequenceDirection,
            sequence: sequence.sort(sortMoves),
          };
        }
      }
    }
    return { win: false, direction: Direction.NONE, sequence: [] };
  }

  play(column: number, player: Player) {
    if (!this.canPlay(column)) {
      return;
    }
    const idx = this.convertRowColToIdx(this.height[column], column);
    this._grid[idx] = player;
    this._height[column]++;
  }

  get height(): number[] {
    const heightCopy = [];
    for (let i = 0; i < COLUMNS; i++) {
      heightCopy.push(this._height[i]);
    }
    return heightCopy;
  }

  get numMoves(): number {
    return this._grid.filter(c => c !== FREE_CELL).length;
  }

  get remainingMoves(): number {
    return ROWS * COLUMNS - this.numMoves;
  }

  numPieces(player: Player): number {
    return this._grid.filter(c => c === player).length;
  }

  get newGrid(): string[] {
    return JSON.parse(JSON.stringify(this._grid));
  }

  isDraw() {
    return this.numMoves === ROWS * COLUMNS;
  }

  print() {
    let str = "";
    for (let i = ROWS - 1; i >= 0; i--) {
      for (let j = 0; j < COLUMNS; j++) {
        str += `${this._grid[this.convertRowColToIdx(i, j)]} `;
      }
      str += "\n";
    }
    return str;
  }

  isFreeCell(row: number, column: number): boolean {
    const idx = this.convertRowColToIdx(row, column);
    return this._grid[idx] === FREE_CELL;
  }

  isSamePlayer(row: number, column: number, player: Player): boolean {
    const idx = this.convertRowColToIdx(row, column);
    return this._grid[idx] === player;
  }

  generateChildBoards(player = Player.COMPUTER): ChildBoard[] {
    const childBoards: ChildBoard[] = [];
    for (let column = 0; column < COLUMNS; column++) {
      if (this.canPlay(column)) {
        const board = new Board(this._grid);
        board.play(column, player);
        childBoards.push({ column, board });
      }
    }
    return childBoards;
  }
}
