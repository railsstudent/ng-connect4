import { Component, OnInit, Input } from "@angular/core";
import { Store, select } from "@ngrx/store";
import {
  AppState,
  selectMovesLeft,
  selectColumnAvailable,
  selectNextPlayer,
  selectGrid,
  selectOutcome,
  selectResetGame,
  selectWinningSequence
} from "../reducers";
import * as connectActions from "../reducers/connect.actions";
import { Player, Mode, ROWS, COLUMNS, FREE_CELL, Direction } from "../models";
import { createSolver } from "../solvers";
import { GridUtil } from "../util/grid.util";
import { MinimaxSolver } from "../solvers/minimax-solver";
import { AlphabetaSolver } from "../solvers/alphabeta-solver";

@Component({
  selector: "connect-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit {
  _Mode = Mode;
  _Player = Player;

  @Input()
  mode: Mode;

  // Observables
  grid$ = this.store.pipe(select(selectGrid));
  moveLefts$ = this.store.pipe(select(selectMovesLeft));
  columnAvailable$ = this.store.pipe(select(selectColumnAvailable));
  nextPlayer$ = this.store.pipe(select(selectNextPlayer));
  outcome$ = this.store.pipe(select(selectOutcome));
  resetGame$ = this.store.pipe(select(selectResetGame));
  winningSequence$ = this.store.pipe(select(selectWinningSequence));
  nextPlayer: Player;
  columnsAvailable: boolean[];

  // AI algorithm
  solver: MinimaxSolver | AlphabetaSolver;
  gridUtil: GridUtil;
  grid: string[];

  rowRange = this.rangeHelper(ROWS, false);
  columnRange = this.rangeHelper(COLUMNS);
  totalColumns = COLUMNS;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    if (!this.solver) {
      this.initSolver();
    }
    this.store.dispatch(new connectActions.NewGameAction({ mode: this.mode }));
    this.nextPlayer$.subscribe(({ reset, nextPlayer }) => {
      this.nextPlayer = nextPlayer;
      if (reset === false && this.nextPlayer === Player.COMPUTER) {
        const { col } = this.solver.bestMove(this.gridUtil.newGrid);
        console.log("dispatch computerMoveAction", col);
        this.store.dispatch(
          new connectActions.ComputerMoveAction({
            player: this.nextPlayer,
            column: col
          })
        );
      }
    });
    this.grid$.subscribe(grid => {
      this.gridUtil.setGrid(grid);
      this.grid = grid;
    });
    this.columnAvailable$.subscribe(
      columnsAvailable => (this.columnsAvailable = columnsAvailable)
    );
  }

  initSolver() {
    this.solver = createSolver();
    this.gridUtil = new GridUtil();
    this.solver.setMinimizePlayer(Player.PLAYER1);
    this.solver.setMaximizePlayer(Player.COMPUTER);
    const grid: string[] = [];
    for (let i = 0; i < ROWS * COLUMNS; i++) {
      grid.push(FREE_CELL);
    }
    this.gridUtil.setGrid(grid);
    this.solver.setGridUtil(this.gridUtil);
  }

  select(column) {
    if (this.columnsAvailable[column] === false) {
      return;
    }
    if (this.nextPlayer === Player.PLAYER1) {
      this.store.dispatch(
        new connectActions.PlayerOneMoveAction({
          mode: this.mode,
          player: this.nextPlayer,
          column
        })
      );
    } else if (this.nextPlayer === Player.PLAYER2) {
      this.store.dispatch(
        new connectActions.PlayerTwoMoveAction({
          player: this.nextPlayer,
          column
        })
      );
    }
  }

  clearState() {
    this.store.dispatch(new connectActions.NewGameAction({ mode: this.mode }));
  }

  backToMode() {
    this.store.dispatch(new connectActions.ChooseModeAction());
  }

  // for testing
  setTestSolver(solver: MinimaxSolver | AlphabetaSolver) {
    this.solver = solver;
  }

  private rangeHelper(exclusiveNum: number, increasing: boolean = true) {
    if (exclusiveNum <= 0) {
      return [];
    }
    const arr = [];
    if (increasing === true) {
      for (let i = 0; i < exclusiveNum; i++) {
        arr.push(i);
      }
    } else {
      for (let i = exclusiveNum - 1; i >= 0; i--) {
        arr.push(i);
      }
    }
    return arr;
  }

  isFreeCell(row: number, column: number) {
    return this.grid[row * COLUMNS + column] === FREE_CELL;
  }

  isSamePlayer(row: number, column: number, player: Player) {
    return this.grid[row * COLUMNS + column] === player;
  }

  strikeThrough(
    { direction, sequence, winner },
    row: number,
    column: number,
    delta: number
  ) {
    const idx = row * COLUMNS + column;
    if (
      direction == null ||
      !sequence ||
      !winner ||
      this.grid[idx] !== winner ||
      sequence.indexOf(idx) < 0
    ) {
      return false;
    }
    switch (delta) {
      case 1:
        return direction === Direction.HORIZONTAL;
      case 7:
        return direction === Direction.VERTICAL;
      case 6:
        return direction === Direction.LEFT_DIAG;
      case 8:
        return direction === Direction.RIGHT_DIAG;
    }
    return false;
  }
}
