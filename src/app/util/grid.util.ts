import {
  FREE_CELL,
  ROWS,
  COLUMNS,
  Player,
  ConnectSequence,
  Direction
} from "../models";

export class GridUtil {
  private _grid: string[];
  private _height: number[] = [];

  constructor() {
    for (let i = 0; i < COLUMNS; i++) {
      this._height.push(0);
    }
  }

  setGrid(grid: string[]) {
    const convertIdxToRowCol = idx => {
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
  isWinningMove(column: number, player): ConnectSequence {
    const sortMoves = (a, b) => a - b;

    if (!this.canPlay(column)) {
      return { win: false, direction: null, sequence: null };
    }

    // check vertical
    if (this.height[column] >= 3) {
      const idx1 = this.convertRowColToIdx(this.height[column] - 1, column);
      const idx2 = this.convertRowColToIdx(this.height[column] - 2, column);
      const idx3 = this.convertRowColToIdx(this.height[column] - 3, column);
      const idx4 = this.convertRowColToIdx(this.height[column], column);
      if (
        this._grid[idx1] === player &&
        this._grid[idx2] === player &&
        this._grid[idx3] === player
      ) {
        return {
          win: true,
          direction: Direction.VERTICAL,
          sequence: [idx1, idx2, idx3, idx4].sort(sortMoves)
        };
      }
    }

    // check horizontal, left diagonally and right diagonally
    let pieces = 0;
    // 0 is horizontal checking, -1 is left-diagonally checking, 1 is right-diagonally
    for (let direction = -1; direction <= 1; direction++) {
      for (let x = 3; x >= 0; x--) {
        pieces = 0;
        const sequence = [];
        for (let delta = -3; delta <= 0; delta++) {
          const colIdx = column + delta + x;
          const rowIdx = this._height[column] + direction * (delta + x);
          if (delta !== -x) {
            if (
              colIdx >= 0 &&
              colIdx < COLUMNS &&
              rowIdx >= 0 &&
              rowIdx < ROWS
            ) {
              const idx = this.convertRowColToIdx(rowIdx, colIdx);
              sequence.push(idx);
              if (
                idx >= 0 &&
                idx < ROWS * COLUMNS &&
                this._grid[idx] === player
              ) {
                pieces += 1;
              } else {
                break;
              }
            }
          } else {
            if (
              colIdx >= 0 &&
              colIdx < COLUMNS &&
              rowIdx >= 0 &&
              rowIdx < ROWS
            ) {
              const idx = this.convertRowColToIdx(rowIdx, colIdx);
              sequence.push(idx);
            }
          }
        }
        if (pieces === 3) {
          let sequenceDirection = null;
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
            sequence: sequence.sort(sortMoves)
          };
        }
      }
    }
    return { win: false, direction: null, sequence: null };
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
}
