import { FREE_CELL, ROWS, COLUMNS } from "../models/";

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
      const { row, col } = convertIdxToRowCol(i);
      this._grid.push(grid[i]);
      if (grid[i] !== FREE_CELL) {
        this._height[col]++;
      }
    }
  }

  private convertRowColToIdx(row, col) {
    if (row >= 0 && row < ROWS && col >= 0 && col < COLUMNS) {
      return row * COLUMNS + col;
    }
    return -1;
  }

  canPlay(column) {
    if (column < 0 || column >= COLUMNS) {
      return false;
    }
    return this._height[column] < ROWS;
  }

  isWinningMove(column, player) {
    if (!this.canPlay(column)) {
      return false;
    }

    // check vertical
    if (this.height[column] >= 3) {
      const idx1 = this.convertRowColToIdx(this.height[column] - 1, column);
      const idx2 = this.convertRowColToIdx(this.height[column] - 2, column);
      const idx3 = this.convertRowColToIdx(this.height[column] - 3, column);
      if (
        this._grid[idx1] === player &&
        this._grid[idx2] === player &&
        this._grid[idx3] === player
      ) {
        return true;
      }
    }

    // check horizontal, left diagonally and right diagonally
    let pieces = 0;
    // 0 is horizontal checking, -1 is left-diagonally checking, 1 is right-diagonally
    for (let direction = -1; direction <= 1; direction++) {
      for (let x = 3; x >= 0; x--) {
        pieces = 0;
        for (let delta = -3; delta <= 0; delta++) {
          if (delta !== -x) {
            const colIdx = column + delta + x;
            const rowIdx = this._height[column] + direction * (delta + x);
            if (
              colIdx >= 0 &&
              colIdx < COLUMNS &&
              rowIdx >= 0 &&
              rowIdx < ROWS
            ) {
              const idx = this.convertRowColToIdx(rowIdx, colIdx);
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
          }
        }
        if (pieces === 3) {
          return true;
        }
      }
    }
    return false;
  }

  play(column, player) {
    if (!this.canPlay(column)) {
      return;
    }
    const idx = this.convertRowColToIdx(this.height[column], column);
    this._grid[idx] = player;
    this._height[column]++;

    return JSON.parse(JSON.stringify(this._grid));
  }

  get height() {
    const heightCopy = [];
    for (let i = 0; i < COLUMNS; i++) {
      heightCopy.push(this._height[i]);
    }
    return heightCopy;
  }

  get numMoves() {
    return this._grid.filter(c => c !== FREE_CELL).length;
  }

  get newGrid() {
    return JSON.parse(JSON.stringify(this._grid));
  }
}
