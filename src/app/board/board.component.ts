import { Component, ElementRef, Input, OnInit, QueryList, Renderer2, ViewChildren } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { COLUMNS, Direction, Mode, Player, ROWS, Outcome } from "../models";
import {
  AppState,
  selectColumnAvailable,
  selectGrid,
  selectLastMove,
  selectMovesLeft,
  selectNextPlayer,
  selectOutcome,
  selectResetGame,
  selectWinningSequence,
} from "../reducers";
import * as connectActions from "../reducers/connect.actions";
import { createSolver, SolverType } from "../solvers";
import { Board } from "../util/board";

@Component({
  selector: "connect-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"],
})
export class BoardComponent implements OnInit {
  _Mode = Mode;
  _Player = Player;
  _Outcome = Outcome;

  @Input()
  mode: Mode;

  @Input()
  playerOneName = "";

  @Input()
  playerTwoName = "";

  // Observables
  grid$ = this.store.pipe(select(selectGrid));
  moveLefts$ = this.store.pipe(select(selectMovesLeft));
  columnAvailable$ = this.store.pipe(select(selectColumnAvailable));
  nextPlayer$ = this.store.pipe(select(selectNextPlayer));
  outcome$ = this.store.pipe(select(selectOutcome));
  resetGame$ = this.store.pipe(select(selectResetGame));
  winningSequence$ = this.store.pipe(select(selectWinningSequence));
  lastMove$ = this.store.pipe(select(selectLastMove));
  nextPlayer: Player;
  columnsAvailable: boolean[] = [];

  // AI algorithm
  solver: SolverType;
  board: Board;
  grid: string[] = [];

  rowRange = this.rangeHelper(ROWS, false);
  columnRange = this.rangeHelper(COLUMNS);
  totalColumns = COLUMNS;
  computerFlag = false;

  @ViewChildren("circles")
  gridCells: QueryList<ElementRef>;

  constructor(private store: Store<AppState>, private renderer: Renderer2) {}

  ngOnInit() {
    this.board = new Board();
    if (!this.solver) {
      this.initSolver();
    }
    this.store.dispatch(connectActions.NewGameAction({ mode: this.mode }));
    this.grid$.subscribe(({ board, reset, nextPlayer }) => {
      this.board = board;
      this.nextPlayer = nextPlayer;
      if (reset === false && this.nextPlayer === Player.COMPUTER && this.computerFlag === true) {
        this.computerFlag = false;
        setTimeout(() => {
          if (this.nextPlayer === Player.COMPUTER) {
            const col = this.solver.bestMove(this.board);
            this.store.dispatch(
              connectActions.ComputerMoveAction({
                player: this.nextPlayer,
                column: col,
              }),
            );
          }
        }, 1);
      }
    });
    this.columnAvailable$.subscribe(columnsAvailable => (this.columnsAvailable = columnsAvailable));
    this.lastMove$.subscribe(({ lastMove, lastMoveIdx }) => {
      if (
        lastMove &&
        this.gridCells &&
        typeof lastMoveIdx !== "undefined" &&
        lastMoveIdx !== null &&
        lastMoveIdx >= 0
      ) {
        const { row, col } = lastMove;
        const el = this.gridCells.toArray()[lastMoveIdx];
        if (!el) {
          return;
        }

        const className = this.getPieceColorClass(row, col);
        if (className !== "") {
          this.renderer.removeClass(el.nativeElement, "free-cell");
          this.renderer.addClass(el.nativeElement, className);
        }
      }
    });
  }

  initSolver() {
    this.solver = createSolver();
    this.solver.setMinimizePlayer(Player.PLAYER1);
    this.solver.setMaximizePlayer(Player.COMPUTER);
  }

  select(column: number) {
    if (this.columnsAvailable[column] === false) {
      return;
    }
    if (this.nextPlayer === Player.PLAYER1) {
      this.computerFlag = true;
      this.store.dispatch(
        connectActions.PlayerOneMoveAction({
          mode: this.mode,
          player: this.nextPlayer,
          column,
        }),
      );
    } else if (this.nextPlayer === Player.PLAYER2) {
      this.store.dispatch(
        connectActions.PlayerTwoMoveAction({
          player: this.nextPlayer,
          column,
        }),
      );
    }
  }

  clearState() {
    this.store.dispatch(connectActions.NewGameAction({ mode: this.mode }));
    if (this.gridCells) {
      const gridCellsArray = this.gridCells.toArray();
      gridCellsArray.forEach(g => {
        if (g && g.nativeElement) {
          this.renderer.setAttribute(g.nativeElement, "class", "grid-circle free-cell");
        }
      });
    }
  }

  backToMode() {
    this.store.dispatch(connectActions.ChooseModeAction());
  }

  // for testing
  setTestSolver(solver: SolverType) {
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

  isSamePlayer(row: number, column: number, player: Player) {
    return this.board.isSamePlayer(row, column, player);
  }

  getPieceColorClass(row: number, column: number) {
    if (this.board.isSamePlayer(row, column, Player.PLAYER1)) {
      return "player1";
    }

    if (this.board.isSamePlayer(row, column, Player.PLAYER2)) {
      return "player2";
    }

    if (this.board.isSamePlayer(row, column, Player.COMPUTER)) {
      return "player2";
    }

    return "";
  }

  strikeThrough(
    winningBoard: { direction: Direction | null; sequence: number[] | null; winner: Player | null },
    row: number,
    column: number,
    delta: number,
  ) {
    const { direction, sequence, winner } = winningBoard;
    const idx = row * COLUMNS + column;

    if (
      direction == null ||
      !sequence ||
      !winner ||
      !this.isSamePlayer(row, column, winner) ||
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
