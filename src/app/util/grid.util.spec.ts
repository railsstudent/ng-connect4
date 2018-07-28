import { TestBed, inject } from '@angular/core/testing';

import { GridUtil } from './grid.util';
import { ROWS, COLUMNS, FREE_CELL, Player } from '../models/index';

describe('GridUtil', () => {
  let gridUtil = new GridUtil();  
  let grid = [];
  beforeAll(() => {
    for (let i = 0; i < ROWS * COLUMNS; i++) {
      grid.push(FREE_CELL); 
    }
    gridUtil.setGrid(grid);
  });

  describe('canPlay returns true for all columns in a new grid', () => {
    it('all columns can play when grid is empty', () => {
      for (let i = 0; i < COLUMNS; i++) {
        expect(gridUtil.canPlay(i)).toBe(true);
      }
    });

    it('all columns have height 0', () => {
      for (let i = 0; i < COLUMNS; i++) {
        expect(gridUtil.height[i]).toBe(0);
      }
    });

    it('zero move is made', () => {
        expect(gridUtil.numMoves).toBe(0);
    });
  });

  describe('canPlay returns true if the column has vacant cell', () => {
    beforeEach(() => {
      let cloneGrid = JSON.parse(JSON.stringify(grid));
      [0,5,8,10,19,22,24,33,36].forEach((i) => cloneGrid[i] = Player.PLAYER2);
      [1,3,4,12,15,17,26,29].forEach((i) => cloneGrid[i] = Player.PLAYER1);
      gridUtil.setGrid(cloneGrid);
    });

    it('columns can play', () => {
      expect(gridUtil.canPlay(0)).toBe(true);
      expect(gridUtil.canPlay(2)).toBe(true);
      expect(gridUtil.canPlay(3)).toBe(true);
      expect(gridUtil.canPlay(4)).toBe(true);
      expect(gridUtil.canPlay(5)).toBe(true);
      expect(gridUtil.canPlay(6)).toBe(true);
    });

    it('column cannot play', () => {
      expect(gridUtil.canPlay(1)).toBe(false);
    });

    it('columns have the correct height', () => {
      expect(gridUtil.height[0]).toBe(1);
      expect(gridUtil.height[1]).toBe(6);
      expect(gridUtil.height[2]).toBe(0);
      expect(gridUtil.height[3]).toBe(4);
      expect(gridUtil.height[4]).toBe(1);
      expect(gridUtil.height[5]).toBe(5);
      expect(gridUtil.height[6]).toBe(0);
    });

    it('grid has correct number of moves', () => {
      expect(gridUtil.numMoves).toBe(17);
    });
  });

  describe('play updates column height and grid cell with player\'s piece', () => {
    beforeEach(() => {
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL); 
      }
      gridUtil.setGrid(grid);
    });

    it('Add a single piece to grid', () => {
      gridUtil.play(0, Player.PLAYER1);
      expect(gridUtil.height[0]).toBe(1);
      expect(gridUtil.numMoves).toBe(1);
    });

    it('Add multiple pieces to the same column', () => {
      gridUtil.play(6, Player.PLAYER1);
      gridUtil.play(6, Player.PLAYER2);
      gridUtil.play(6, Player.PLAYER1);
      gridUtil.play(6, Player.PLAYER2);
      expect(gridUtil.height[6]).toBe(4);
      expect(gridUtil.numMoves).toBe(4);
    });

    it('Add multiple pieces to the same column until it is filled entirely', () => {
      gridUtil.play(6, Player.PLAYER1);
      gridUtil.play(6, Player.PLAYER2);
      gridUtil.play(6, Player.PLAYER1);
      gridUtil.play(6, Player.PLAYER2);
      gridUtil.play(6, Player.PLAYER1);
      gridUtil.play(6, Player.PLAYER2);
      gridUtil.play(6, Player.PLAYER1);
      expect(gridUtil.height[6]).toBe(6);
      expect(gridUtil.numMoves).toBe(6);
    });

    it('Add multiple pieces in different columns', () => {
      gridUtil.play(6, Player.PLAYER1);
      gridUtil.play(6, Player.PLAYER2);

      gridUtil.play(3, Player.PLAYER1);
      gridUtil.play(4, Player.PLAYER2);
      gridUtil.play(3, Player.PLAYER1);      
      gridUtil.play(4, Player.PLAYER2);
      gridUtil.play(4, Player.PLAYER1);
      gridUtil.play(1, Player.PLAYER2);

      gridUtil.play(5, Player.PLAYER1);
      expect(gridUtil.height[0]).toBe(0);
      expect(gridUtil.height[1]).toBe(1);
      expect(gridUtil.height[2]).toBe(0);
      expect(gridUtil.height[3]).toBe(2);
      expect(gridUtil.height[4]).toBe(3);
      expect(gridUtil.height[5]).toBe(1);
      expect(gridUtil.height[6]).toBe(2);

      expect(gridUtil.numMoves).toBe(9);
    });
  });

  describe('play updates column height and grid cell with player\'s piece', () => {
    beforeEach(() => {
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL); 
      }
      gridUtil.setGrid(grid);
    });

    it('Add a single piece to grid', () => {
      gridUtil.play(0, Player.PLAYER1);
      expect(gridUtil.height[0]).toBe(1);
      expect(gridUtil.numMoves).toBe(1);
    });

    it('Add multiple pieces to the same column', () => {
      gridUtil.play(6, Player.PLAYER1);
      gridUtil.play(6, Player.PLAYER2);
      gridUtil.play(6, Player.PLAYER1);
      gridUtil.play(6, Player.PLAYER2);
      expect(gridUtil.height[6]).toBe(4);
      expect(gridUtil.numMoves).toBe(4);
    });

    it('Add multiple pieces to the same column until it is filled entirely', () => {
      gridUtil.play(6, Player.PLAYER1);
      gridUtil.play(6, Player.PLAYER2);
      gridUtil.play(6, Player.PLAYER1);
      gridUtil.play(6, Player.PLAYER2);
      gridUtil.play(6, Player.PLAYER1);
      gridUtil.play(6, Player.PLAYER2);
      gridUtil.play(6, Player.PLAYER1);
      expect(gridUtil.height[6]).toBe(6);
      expect(gridUtil.numMoves).toBe(6);
    });

    it('Add multiple pieces in different columns', () => {
      gridUtil.play(6, Player.PLAYER1);
      gridUtil.play(6, Player.PLAYER2);

      gridUtil.play(3, Player.PLAYER1);
      gridUtil.play(4, Player.PLAYER2);
      gridUtil.play(3, Player.PLAYER1);      
      gridUtil.play(4, Player.PLAYER2);
      gridUtil.play(4, Player.PLAYER1);
      gridUtil.play(1, Player.PLAYER2);

      gridUtil.play(5, Player.PLAYER1);
      expect(gridUtil.height[0]).toBe(0);
      expect(gridUtil.height[1]).toBe(1);
      expect(gridUtil.height[2]).toBe(0);
      expect(gridUtil.height[3]).toBe(2);
      expect(gridUtil.height[4]).toBe(3);
      expect(gridUtil.height[5]).toBe(1);
      expect(gridUtil.height[6]).toBe(2);

      expect(gridUtil.numMoves).toBe(9);
    });
  });

  describe('isWinningMove return true if 4 pieces are connected together vertically', () => {
    beforeEach(() => {
      grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL); 
      }
      gridUtil.setGrid(grid);
    });

    it('return true if it is vertically connected', () => {
      gridUtil.play(0, Player.PLAYER1);
      gridUtil.play(1, Player.PLAYER2);
      gridUtil.play(0, Player.PLAYER1);
      gridUtil.play(1, Player.PLAYER2);
      gridUtil.play(0, Player.PLAYER1);
      gridUtil.play(1, Player.PLAYER2);
      expect(gridUtil.isWinningMove(0, Player.PLAYER1)).toBe(true);
    });

    it('return true if it is vertically connected 2', () => {
      gridUtil.play(0, Player.PLAYER1);
      gridUtil.play(0, Player.PLAYER2);
      gridUtil.play(0, Player.PLAYER1);
      gridUtil.play(1, Player.PLAYER2);
      gridUtil.play(0, Player.PLAYER1);
      gridUtil.play(1, Player.PLAYER2);
      gridUtil.play(0, Player.PLAYER1);
      gridUtil.play(1, Player.PLAYER2);
      expect(gridUtil.isWinningMove(0, Player.PLAYER1)).toBe(true);
    });

    it('return true if it is vertically connected 3', () => {
      gridUtil.play(4, Player.PLAYER1);
      gridUtil.play(4, Player.PLAYER2);
      gridUtil.play(5, Player.PLAYER1);
      gridUtil.play(4, Player.PLAYER2);
      gridUtil.play(5, Player.PLAYER1);
      gridUtil.play(4, Player.PLAYER2);
      gridUtil.play(5, Player.PLAYER1);
      expect(gridUtil.isWinningMove(4, Player.PLAYER2)).toBe(true);
    });
  });

  describe('isWinningMove return true if 4 pieces are connected together horizontally', () => {
    beforeEach(() => {
      grid = [];
      for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.push(FREE_CELL); 
      }
      gridUtil.setGrid(grid);
    });

    it('return true if it is horizontally connected and the winning piece is the second one of the connected 4', () => { 
      [0,2,4,5,11].forEach((i) => grid[i] = Player.PLAYER1);
      [1,3,7,8,10].forEach((i) => grid[i] = Player.PLAYER2);
      gridUtil.setGrid(grid);
      expect(gridUtil.isWinningMove(2, Player.PLAYER2)).toBe(true);
    });

    it('return true if it is horizontally connected and the winning piece is the third one of the connected 4', () => {
      [1,3,5,6,13,20].forEach((i) => grid[i] = Player.PLAYER1);
      [2,4,8,9,11].forEach((i) => grid[i] = Player.PLAYER2);
      gridUtil.setGrid(grid);
      expect(gridUtil.isWinningMove(3, Player.PLAYER2)).toBe(true);
    });

    it('return true if it is horizontally connected and the winning piece is the last one of the connected 4', () => {
      [3,5,10,11,12].forEach((i) => grid[i] = Player.PLAYER1);
      [4,6,17,18,19].forEach((i) => grid[i] = Player.PLAYER2);
      gridUtil.setGrid(grid);
      expect(gridUtil.isWinningMove(6, Player.PLAYER1)).toBe(true);
    });

    it('return true if it is horizontally connected and the winning piece is the first one of the connected 4', () => {
      [1,3,4,5,12,19].forEach((i) => grid[i] = Player.PLAYER1);
      [2,6,9,10,11].forEach((i) => grid[i] = Player.PLAYER2);
      gridUtil.setGrid(grid);
      expect(gridUtil.isWinningMove(1, Player.PLAYER2)).toBe(true);
    });

    it('return true if it is horizontally connected and it is actually connect 5', () => {
      [1,3,4,5,15,19,22].forEach((i) => grid[i] = Player.PLAYER1);
      [2,8,9,11,12,18].forEach((i) => grid[i] = Player.PLAYER2);
      gridUtil.setGrid(grid);
      expect(gridUtil.isWinningMove(3, Player.PLAYER2)).toBe(true);
    });
  });
});
