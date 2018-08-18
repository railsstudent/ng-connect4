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
import { Player, Mode, ROWS, COLUMNS, Direction } from "../models";
import { createSolver, SolverType } from "../solvers";
import { Board } from "../util/board";

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
  solver: SolverType;
  board: Board;
  grid: string[];

  rowRange = this.rangeHelper(ROWS, false);
  columnRange = this.rangeHelper(COLUMNS);
  totalColumns = COLUMNS;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.board = new Board();
    if (!this.solver) {
      this.initSolver();
    }
    this.store.dispatch(new connectActions.NewGameAction({ mode: this.mode }));
    this.grid$.subscribe(({ board, reset, nextPlayer }) => {
      this.board = board;
      this.nextPlayer = nextPlayer;
      if (reset === false && this.nextPlayer === Player.COMPUTER) {
        const totalHumanPieces = board.numPieces(Player.PLAYER1);
        const totalComputerPieces = board.numPieces(Player.COMPUTER);
        if (totalComputerPieces >= totalHumanPieces) {
          console.log(
            "Do not make consecutive computer moves",
            `human: ${totalHumanPieces}, computer: ${totalComputerPieces}`
          );
          return;
        }
        const col = this.solver.bestMove(this.board);
        console.log("dispatch computerMoveAction", col);
        this.store.dispatch(
          new connectActions.ComputerMoveAction({
            player: this.nextPlayer,
            column: col
          })
        );
      }
    });
    this.columnAvailable$.subscribe(columnsAvailable => (this.columnsAvailable = columnsAvailable));
  }

  initSolver() {
    this.solver = createSolver();
    this.solver.setMinimizePlayer(Player.PLAYER1);
    this.solver.setMaximizePlayer(Player.COMPUTER);
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

  isFreeCell(row: number, column: number) {
    return this.board.isFreeCell(row, column);
  }

  isSamePlayer(row: number, column: number, player: Player) {
    return this.board.isSamePlayer(row, column, player);
  }

  strikeThrough({ direction, sequence, winner }, row: number, column: number, delta: number) {
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
