import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Store, StoreModule } from "@ngrx/store";
import { COLUMNS, Direction, Mode, Outcome, Player, ROWS } from "../models";
import { AppState, reducers } from "../reducers";
import * as connectActions from "../reducers/connect.actions";
import { AlphabetaSolver } from "../solvers/alphabeta-solver";
import { Board } from "../util/board";
import { BoardComponent } from "./board.component";

describe("BoardComponent", () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let store: Store<AppState>;

  const getBoardTitle = () => fixture.debugElement.query(By.css(".board-title"));
  const getMovesLeftLabel = () => fixture.debugElement.query(By.css(".moves-left-label"));
  const getColumnsAvailable = () => fixture.debugElement.queryAll(By.css(".select-column"));
  const getColumnAvailable = (i: number) => {
    const allColumns = fixture.debugElement.queryAll(By.css(".select-column"));
    return allColumns[i];
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BoardComponent],
      imports: [StoreModule.forRoot(reducers)],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(Store);
    spyOn(store, "dispatch").and.callThrough();
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    component.mode = Mode.HUMAN_VS_HUMAN;
    component.players = {
      playerOne: "Jack",
      playerTwo: "Jill",
    };
    spyOn(component, "initSolver").and.callThrough();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show title", () => {
    const p = getBoardTitle().nativeElement as HTMLParagraphElement;
    expect(p.textContent).toBe("Connect Four Game");
    expect(component.initSolver).toHaveBeenCalled();
    expect(component.initSolver).toHaveBeenCalledTimes(1);
  });

  it("should dispatch action to initialize new game", () => {
    const action = connectActions.NewGameAction({
      mode: Mode.HUMAN_VS_HUMAN,
    });

    expect(component.initSolver).toHaveBeenCalled();
    expect(component.initSolver).toHaveBeenCalledTimes(1);

    expect(store.dispatch).toHaveBeenCalledWith(action);
    expect(store.dispatch).toHaveBeenCalledTimes(1);

    component.moveLefts$.subscribe(moveLefts => expect(moveLefts).toBe(ROWS * COLUMNS));
  });

  it("should update moves left after dispatch action", () => {
    expect(component.initSolver).toHaveBeenCalled();
    expect(component.initSolver).toHaveBeenCalledTimes(1);

    const spanLabel = getMovesLeftLabel().nativeElement as HTMLSpanElement;
    expect(spanLabel.textContent).toBe("Remaining Moves:");

    store.dispatch(
      connectActions.PlayerOneMoveAction({
        mode: component.mode,
        player: Player.PLAYER1,
        column: 0,
      }),
    );
    component.moveLefts$.subscribe(moveLefts => expect(moveLefts).toBe(ROWS * COLUMNS - 1));
  });

  it("should show all columns are available when game just starts", () => {
    expect(component.initSolver).toHaveBeenCalled();
    expect(component.initSolver).toHaveBeenCalledTimes(1);

    expect(getColumnsAvailable().length).toBe(COLUMNS);
  });

  it("should not show outcome and reset game button", () => {
    expect(component.initSolver).toHaveBeenCalled();
    expect(component.initSolver).toHaveBeenCalledTimes(1);

    component.outcome$.subscribe(outcome => expect(outcome).toEqual(Outcome.DEFAULT));
    component.resetGame$.subscribe(resetGame => expect(resetGame).toBe(false));
  });

  describe("Human vs Human test cases", () => {
    it("should update moves left after dispatch action", () => {
      expect(component.initSolver).toHaveBeenCalled();
      expect(component.initSolver).toHaveBeenCalledTimes(1);

      const spanLabel = getMovesLeftLabel().nativeElement as HTMLSpanElement;
      expect(spanLabel.textContent).toBe("Remaining Moves:");

      store.dispatch(
        connectActions.PlayerOneMoveAction({
          mode: component.mode,
          player: Player.PLAYER1,
          column: 0,
        }),
      );
      store.dispatch(
        connectActions.PlayerTwoMoveAction({
          player: Player.PLAYER2,
          column: 1,
        }),
      );
      store.dispatch(
        connectActions.PlayerOneMoveAction({
          mode: component.mode,
          player: Player.PLAYER1,
          column: 0,
        }),
      );
      store.dispatch(
        connectActions.PlayerTwoMoveAction({
          player: Player.PLAYER2,
          column: 2,
        }),
      );

      component.moveLefts$.subscribe(moveLefts => expect(moveLefts).toBe(ROWS * COLUMNS - 4));
      component.lastMove$.subscribe(o => {
        expect(o.lastMove).toEqual({
          row: 0,
          col: 2,
        });
        expect(o.lastMoveIdx).toEqual(37);
      });
    });

    it("should hide column when it is full in human vs human mode", () => {
      expect(component.initSolver).toHaveBeenCalled();
      expect(component.initSolver).toHaveBeenCalledTimes(1);

      const elFirstColumn = getColumnAvailable(0);
      elFirstColumn.triggerEventHandler("click", 0);
      elFirstColumn.triggerEventHandler("click", 0);
      elFirstColumn.triggerEventHandler("click", 0);
      elFirstColumn.triggerEventHandler("click", 0);
      elFirstColumn.triggerEventHandler("click", 0);
      elFirstColumn.triggerEventHandler("click", 0);

      component.columnAvailable$.subscribe(columnAvailable => {
        const expectedResults: boolean[] = [];
        for (let i = 0; i < COLUMNS; i++) {
          expectedResults.push(true);
        }
        expectedResults[0] = false;
        columnAvailable.forEach((c, i) => {
          expect(c).toBe(expectedResults[i]);
        });
      });

      component.grid$.subscribe(({ board }) => {
        expect(board.isSamePlayer(0, 0, Player.PLAYER1)).toBe(true);
        expect(board.isSamePlayer(2, 0, Player.PLAYER1)).toBe(true);
        expect(board.isSamePlayer(4, 0, Player.PLAYER1)).toBe(true);

        expect(board.isSamePlayer(1, 0, Player.PLAYER2)).toBe(true);
        expect(board.isSamePlayer(3, 0, Player.PLAYER2)).toBe(true);
        expect(board.isSamePlayer(5, 0, Player.PLAYER2)).toBe(true);
      });

      component.moveLefts$.subscribe(moveLefts => expect(moveLefts).toBe(ROWS * COLUMNS - 6));

      component.outcome$.subscribe(outcome => expect(outcome).toEqual(Outcome.DEFAULT));

      component.winningSequence$.subscribe(sequence =>
        expect(sequence).toEqual({
          direction: Direction.NONE,
          sequence: [],
          winner: null,
        }),
      );

      component.lastMove$.subscribe(o => {
        expect(o.lastMove).toEqual({
          row: 5,
          col: 0,
        });
        expect(o.lastMoveIdx).toEqual(0);
      });
    });

    it("should show player 1 wins in human vs human mode", () => {
      expect(component.initSolver).toHaveBeenCalled();
      expect(component.initSolver).toHaveBeenCalledTimes(1);

      const elFirstColumn = getColumnAvailable(1);
      const elSecondColumn = getColumnAvailable(2);

      elFirstColumn.triggerEventHandler("click", 1);
      elSecondColumn.triggerEventHandler("click", 2);
      elFirstColumn.triggerEventHandler("click", 1);
      elSecondColumn.triggerEventHandler("click", 2);
      elFirstColumn.triggerEventHandler("click", 1);
      elSecondColumn.triggerEventHandler("click", 2);
      elFirstColumn.triggerEventHandler("click", 1);

      component.moveLefts$.subscribe(movesLeft => expect(movesLeft).toBe(ROWS * COLUMNS - 7));
      component.outcome$.subscribe(outcome => expect(outcome).toEqual(Outcome.PLAYER1_WINS));
      component.resetGame$.subscribe(resetGame => expect(resetGame).toBe(true));
      component.columnAvailable$.subscribe(columns => {
        for (let i = 0; i < COLUMNS; i++) {
          expect(columns[i]).toBe(false);
        }
      });

      component.grid$.subscribe(({ board }) => {
        expect(board.isSamePlayer(0, 1, Player.PLAYER1)).toBe(true);
        expect(board.isSamePlayer(1, 1, Player.PLAYER1)).toBe(true);
        expect(board.isSamePlayer(2, 1, Player.PLAYER1)).toBe(true);
        expect(board.isSamePlayer(3, 1, Player.PLAYER1)).toBe(true);

        expect(board.isSamePlayer(0, 2, Player.PLAYER2)).toBe(true);
        expect(board.isSamePlayer(1, 2, Player.PLAYER2)).toBe(true);
        expect(board.isSamePlayer(2, 2, Player.PLAYER2)).toBe(true);
      });

      component.winningSequence$.subscribe(ws =>
        expect(ws).toEqual({
          direction: Direction.VERTICAL,
          sequence: [1, 8, 15, 22],
          winner: Player.PLAYER1,
        }),
      );

      component.lastMove$.subscribe(o => {
        expect(o.lastMove).toEqual({
          row: 3,
          col: 1,
        });
        expect(o.lastMoveIdx).toEqual(15);
      });
    });

    it("should show player 2 wins in human vs human mode", () => {
      expect(component.initSolver).toHaveBeenCalled();
      expect(component.initSolver).toHaveBeenCalledTimes(1);

      const elFirstColumn = getColumnAvailable(0);
      const elSecondColumn = getColumnAvailable(1);
      const elThirdColumn = getColumnAvailable(2);
      const elFourthColumn = getColumnAvailable(3);
      const elFifthColumn = getColumnAvailable(4);

      elFirstColumn.triggerEventHandler("click", 0);
      elSecondColumn.triggerEventHandler("click", 1);
      elFirstColumn.triggerEventHandler("click", 0);
      elThirdColumn.triggerEventHandler("click", 2);
      elSecondColumn.triggerEventHandler("click", 1);
      elFourthColumn.triggerEventHandler("click", 3);
      elThirdColumn.triggerEventHandler("click", 2);
      elFifthColumn.triggerEventHandler("click", 4);

      component.moveLefts$.subscribe(movesLeft => expect(movesLeft).toBe(ROWS * COLUMNS - 8));
      component.outcome$.subscribe(outcome => expect(outcome).toEqual(Outcome.PLAYER2_WINS));

      component.grid$.subscribe(({ board }) => {
        expect(board.isSamePlayer(0, 0, Player.PLAYER1)).toBe(true);
        expect(board.isSamePlayer(1, 0, Player.PLAYER1)).toBe(true);
        expect(board.isSamePlayer(1, 1, Player.PLAYER1)).toBe(true);
        expect(board.isSamePlayer(1, 2, Player.PLAYER1)).toBe(true);

        expect(board.isSamePlayer(0, 1, Player.PLAYER2)).toBe(true);
        expect(board.isSamePlayer(0, 2, Player.PLAYER2)).toBe(true);
        expect(board.isSamePlayer(0, 3, Player.PLAYER2)).toBe(true);
        expect(board.isSamePlayer(0, 4, Player.PLAYER2)).toBe(true);
      });

      component.winningSequence$.subscribe(ws =>
        expect(ws).toEqual({
          direction: Direction.HORIZONTAL,
          sequence: [1, 2, 3, 4],
          winner: Player.PLAYER2,
        }),
      );
      component.resetGame$.subscribe(resetGame => expect(resetGame).toBe(true));
      component.columnAvailable$.subscribe(columns => {
        for (let i = 0; i < COLUMNS; i++) {
          expect(columns[i]).toBe(false);
        }
      });

      component.lastMove$.subscribe(o => {
        expect(o.lastMove).toEqual({
          row: 0,
          col: 4,
        });
        expect(o.lastMoveIdx).toEqual(39);
      });
    });

    it("should show Draw when the game is tied", () => {
      expect(component.initSolver).toHaveBeenCalled();
      expect(component.initSolver).toHaveBeenCalledTimes(1);

      // c o c o c o c
      // o c o c o c o
      // c o c o c o c
      // c o c o c o c
      // o c o c o c o
      // o c o c o c o

      const elColumns = getColumnsAvailable();
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < COLUMNS - 1; j++) {
          elColumns[j].triggerEventHandler("click", j);
        }
      }

      for (let i = 2; i < 4; i++) {
        for (let j = COLUMNS - 2; j >= 0; j--) {
          elColumns[j].triggerEventHandler("click", j);
        }
      }

      for (let i = 4; i < 6; i++) {
        for (let j = 0; j < COLUMNS - 2; j++) {
          elColumns[j].triggerEventHandler("click", j);
        }
      }

      elColumns[6].triggerEventHandler("click", 6);
      elColumns[5].triggerEventHandler("click", 5);
      elColumns[6].triggerEventHandler("click", 6);
      elColumns[6].triggerEventHandler("click", 6);
      elColumns[5].triggerEventHandler("click", 5);
      elColumns[6].triggerEventHandler("click", 6);
      elColumns[6].triggerEventHandler("click", 6);
      elColumns[5].triggerEventHandler("click", 5);
      elColumns[6].triggerEventHandler("click", 6);

      const expectedGrid = [];

      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);

      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);

      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);

      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);

      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);

      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.PLAYER2);

      const nextBoard = new Board();
      nextBoard.clone(expectedGrid);

      component.grid$.subscribe(({ board }) => expect(board).toEqual(nextBoard));
      component.moveLefts$.subscribe(movesLeft => expect(movesLeft).toBe(0));
      component.outcome$.subscribe(outcome => expect(outcome).toEqual(Outcome.DRAW));
      component.resetGame$.subscribe(resetGame => expect(resetGame).toBe(true));
      component.columnAvailable$.subscribe(columns => {
        for (let i = 0; i < COLUMNS; i++) {
          expect(columns[i]).toBe(false);
        }
      });
      component.winningSequence$.subscribe(sequence =>
        expect(sequence).toEqual({
          direction: Direction.NONE,
          sequence: [],
          winner: null,
        }),
      );

      component.lastMove$.subscribe(o => {
        expect(o.lastMove).toEqual({
          row: 5,
          col: 6,
        });
        expect(o.lastMoveIdx).toEqual(6);
      });
    });
  });

  describe("Human vs Computer test cases", () => {
    class MockSolver extends AlphabetaSolver {
      i = 0;
      dummyMoves: number[];
      constructor(dummyMoves: number[]) {
        super();
        this.dummyMoves = dummyMoves;
      }
      bestMove(board: Board): number {
        const col = this.dummyMoves[this.i];
        this.i++;
        return col;
      }
    }

    beforeEach(() => {
      component.setTestSolver(new MockSolver([0, 0, 0]));
      component.mode = Mode.HUMAN_VS_COMPUTER;
      fixture.detectChanges();
    });

    it("should dispatch computer action after player 1 makes move", () => {
      jasmine.clock().install();
      const elFirstColumn = getColumnAvailable(0);
      elFirstColumn.triggerEventHandler("click", 0);
      jasmine.clock().tick(1);

      const action = connectActions.ComputerMoveAction({
        player: Player.COMPUTER,
        column: 0,
      });

      expect(store.dispatch).toHaveBeenCalledWith(action);
      component.moveLefts$.subscribe(moveLefts => expect(moveLefts).toBe(ROWS * COLUMNS - 2));
      jasmine.clock().uninstall()
    });

    it("should hide column when it is full in human vs computer mode", () => {
      jasmine.clock().install();
      const elFirstColumn = getColumnAvailable(0);

      elFirstColumn.triggerEventHandler("click", 0);
      jasmine.clock().tick(1);

      elFirstColumn.triggerEventHandler("click", 0);
      jasmine.clock().tick(1);

      elFirstColumn.triggerEventHandler("click", 0);
      jasmine.clock().tick(1);

      component.columnAvailable$.subscribe(columnAvailable => {
        const expectedResults: boolean[] = [];
        for (let i = 0; i < COLUMNS; i++) {
          expectedResults.push(true);
        }
        expectedResults[0] = false;
        expect(columnAvailable).toEqual(expectedResults);
      });

      component.grid$.subscribe(({ board }) => {
        expect(board.isSamePlayer(0, 0, Player.PLAYER1)).toBe(true);
        expect(board.isSamePlayer(2, 0, Player.PLAYER1)).toBe(true);
        expect(board.isSamePlayer(4, 0, Player.PLAYER1)).toBe(true);

        expect(board.isSamePlayer(1, 0, Player.COMPUTER)).toBe(true);
        expect(board.isSamePlayer(3, 0, Player.COMPUTER)).toBe(true);
        expect(board.isSamePlayer(5, 0, Player.COMPUTER)).toBe(true);
      });

      component.outcome$.subscribe(outcome => expect(outcome).toEqual(Outcome.DEFAULT));
      component.resetGame$.subscribe(reset => expect(reset).toEqual(false));
      component.winningSequence$.subscribe(sequence =>
        expect(sequence).toEqual({
          direction: Direction.NONE,
          sequence: [],
          winner: null,
        }),
      );

      component.lastMove$.subscribe(o => {
        expect(o.lastMove).toEqual({
          row: 5,
          col: 0,
        });
        expect(o.lastMoveIdx).toEqual(0);
      });

      jasmine.clock().uninstall()
    });

    it("should show player 1 wins in human vs computer mode", () => {
      jasmine.clock().install();
      component.setTestSolver(new MockSolver([1, 1, 1]));
      fixture.detectChanges();

      const elFirstColumn = getColumnAvailable(0);

      elFirstColumn.triggerEventHandler("click", 0);
      jasmine.clock().tick(1);

      elFirstColumn.triggerEventHandler("click", 0);
      jasmine.clock().tick(1);

      elFirstColumn.triggerEventHandler("click", 0);
      jasmine.clock().tick(1);

      elFirstColumn.triggerEventHandler("click", 0);
      jasmine.clock().tick(1);

      component.moveLefts$.subscribe(movesLeft => expect(movesLeft).toBe(ROWS * COLUMNS - 7));
      component.outcome$.subscribe(outcome => expect(outcome).toEqual(Outcome.PLAYER1_WINS));
      component.resetGame$.subscribe(resetGame => expect(resetGame).toBe(true));
      component.columnAvailable$.subscribe(columns => {
        const expected = [];
        for (let i = 0; i < COLUMNS; i++) {
          expected.push(false);
        }
        expect(columns).toEqual(expected);
      });
      component.grid$.subscribe(({ board }) => {
        expect(board.isSamePlayer(0, 0, Player.PLAYER1)).toBe(true);
        expect(board.isSamePlayer(1, 0, Player.PLAYER1)).toBe(true);
        expect(board.isSamePlayer(2, 0, Player.PLAYER1)).toBe(true);
        expect(board.isSamePlayer(3, 0, Player.PLAYER1)).toBe(true);

        expect(board.isSamePlayer(0, 1, Player.COMPUTER)).toBe(true);
        expect(board.isSamePlayer(1, 1, Player.COMPUTER)).toBe(true);
        expect(board.isSamePlayer(2, 1, Player.COMPUTER)).toBe(true);
      });

      component.winningSequence$.subscribe(sequence => {
        expect(sequence).toEqual({
          direction: Direction.VERTICAL,
          sequence: [0, 7, 14, 21],
          winner: Player.PLAYER1,
        });
      });

      component.lastMove$.subscribe(o => {
        expect(o.lastMove).toEqual({
          row: 3,
          col: 0,
        });
        expect(o.lastMoveIdx).toEqual(14);
      });

      jasmine.clock().uninstall();
    });

    it("should show computer wins in human vs computer mode", () => {
      jasmine.clock().install();

      component.setTestSolver(new MockSolver([1, 2, 3, 4]));
      const elFirstColumn = getColumnAvailable(0);
      const elSecondColumn = getColumnAvailable(1);
      const elThirdColumn = getColumnAvailable(2);

      elFirstColumn.triggerEventHandler("click", 0);
      jasmine.clock().tick(1);

      elFirstColumn.triggerEventHandler("click", 0);
      jasmine.clock().tick(1);

      elSecondColumn.triggerEventHandler("click", 1);
      jasmine.clock().tick(1);

      elThirdColumn.triggerEventHandler("click", 2);
      jasmine.clock().tick(1);

      component.moveLefts$.subscribe(movesLeft => expect(movesLeft).toBe(ROWS * COLUMNS - 8));
      component.outcome$.subscribe(outcome => expect(outcome).toEqual(Outcome.COMPUTER_WINS));
      component.resetGame$.subscribe(resetGame => expect(resetGame).toBe(true));
      component.columnAvailable$.subscribe(columns => {
        const expected = [];
        for (let i = 0; i < COLUMNS; i++) {
          expected.push(false);
        }
        expect(columns).toEqual(expected);
      });
      component.grid$.subscribe(({ board }) => {
        expect(board.isSamePlayer(0, 0, Player.PLAYER1)).toBe(true);
        expect(board.isSamePlayer(1, 0, Player.PLAYER1)).toBe(true);
        expect(board.isSamePlayer(1, 1, Player.PLAYER1)).toBe(true);
        expect(board.isSamePlayer(1, 2, Player.PLAYER1)).toBe(true);

        expect(board.isSamePlayer(0, 1, Player.COMPUTER)).toBe(true);
        expect(board.isSamePlayer(0, 2, Player.COMPUTER)).toBe(true);
        expect(board.isSamePlayer(0, 3, Player.COMPUTER)).toBe(true);
        expect(board.isSamePlayer(0, 4, Player.COMPUTER)).toBe(true);
      });

      component.winningSequence$.subscribe(sequence => {
        expect(sequence).toEqual({
          direction: Direction.HORIZONTAL,
          sequence: [1, 2, 3, 4],
          winner: Player.COMPUTER,
        });
      });

      component.lastMove$.subscribe(o => {
        expect(o.lastMove).toEqual({
          row: 0,
          col: 4,
        });
        expect(o.lastMoveIdx).toEqual(39);
      });

      jasmine.clock().uninstall();
    });

    it("should show Draw when the game is tied in human vs computer", () => {
      jasmine.clock().install();

      // c o c o c o c
      // o c o c o c o
      // c o c o c o c
      // c o c o c o c
      // o c o c o c o
      // o c o c o c o
      const computerMoves = [1, 3, 5, 1, 3, 5, 4, 2, 0, 4, 2, 0, 1, 3, 0, 2, 4, 5, 6, 6, 6];
      component.setTestSolver(new MockSolver(computerMoves));
      const elColumns = getColumnsAvailable();

      elColumns[0].triggerEventHandler("click", 0);
      jasmine.clock().tick(1);
      elColumns[2].triggerEventHandler("click", 2);
      jasmine.clock().tick(1);
      elColumns[4].triggerEventHandler("click", 4);
      jasmine.clock().tick(1);
      elColumns[0].triggerEventHandler("click", 0);
      jasmine.clock().tick(1);
      elColumns[2].triggerEventHandler("click", 2);
      jasmine.clock().tick(1);

      elColumns[4].triggerEventHandler("click", 4);
      jasmine.clock().tick(1);
      elColumns[5].triggerEventHandler("click", 5);
      jasmine.clock().tick(1);
      elColumns[3].triggerEventHandler("click", 3);
      jasmine.clock().tick(1);
      elColumns[1].triggerEventHandler("click", 1);
      jasmine.clock().tick(1);

      elColumns[5].triggerEventHandler("click", 5);
      jasmine.clock().tick(1);
      elColumns[3].triggerEventHandler("click", 3);
      jasmine.clock().tick(1);
      elColumns[1].triggerEventHandler("click", 1);
      jasmine.clock().tick(1);
      elColumns[0].triggerEventHandler("click", 0);
      jasmine.clock().tick(1);

      elColumns[2].triggerEventHandler("click", 2);
      jasmine.clock().tick(1);
      elColumns[4].triggerEventHandler("click", 4);
      jasmine.clock().tick(1);
      elColumns[1].triggerEventHandler("click", 1);
      jasmine.clock().tick(1);
      elColumns[3].triggerEventHandler("click", 3);
      jasmine.clock().tick(1);

      elColumns[6].triggerEventHandler("click", 6);
      jasmine.clock().tick(1);
      elColumns[6].triggerEventHandler("click", 6);
      jasmine.clock().tick(1);
      elColumns[5].triggerEventHandler("click", 5);
      jasmine.clock().tick(1);
      elColumns[6].triggerEventHandler("click", 6);
      jasmine.clock().tick(1);

      const expectedGrid = [];

      // o c o c o c o
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);

      // o c o c o c o
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);

      // c o c o c o c
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);

      // c o c o c o c
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);

      // o c o c o c o
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);

      // c o c o c o c
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);
      expectedGrid.push(Player.PLAYER1);
      expectedGrid.push(Player.COMPUTER);

      const nextBoard = new Board();
      nextBoard.clone(expectedGrid);

      component.outcome$.subscribe(outcome => expect(outcome).toEqual(Outcome.DRAW));
      component.grid$.subscribe(({ board }) => expect(board).toEqual(nextBoard));
      component.moveLefts$.subscribe(movesLeft => expect(movesLeft).toEqual(0));
      component.resetGame$.subscribe(resetGame => expect(resetGame).toEqual(true));
      component.columnAvailable$.subscribe(columns => {
        const expected = [];
        for (let i = 0; i < COLUMNS; i++) {
          expected.push(false);
        }
        expect(columns).toEqual(expected);
      });
      component.winningSequence$.subscribe(sequence =>
        expect(sequence).toEqual({
          direction: Direction.NONE,
          sequence: [],
          winner: null,
        }),
      );

      component.lastMove$.subscribe(o => {
        expect(o.lastMove).toEqual({
          row: 5,
          col: 6,
        });
        expect(o.lastMoveIdx).toEqual(6);
      });

      jasmine.clock().uninstall();
    });
  });

  describe("backToMode", () => {
    beforeEach(() => {
      component.backToMode();
      fixture.detectChanges();
    });

    it("store reset to intial state", () => {
      component.lastMove$.subscribe(({ lastMove, lastMoveIdx }) => {
        expect(lastMove).toEqual(null);
        expect(lastMoveIdx).toEqual(null);
      });
      component.nextPlayer$.subscribe(({ nextPlayer }) => expect(nextPlayer).toEqual(Player.PLAYER1));
      component.winningSequence$.subscribe(({ direction, sequence, winner }) => {
        expect(direction).toEqual(null);
        expect(sequence).toEqual(null);
        expect(winner).toEqual(null);
      });
      component.moveLefts$.subscribe(num => expect(num).toBe(ROWS * COLUMNS));
      component.outcome$.subscribe(outcome => expect(outcome).toEqual(Outcome.DEFAULT));
      component.resetGame$.subscribe(reset => expect(reset).toEqual(false));
      component.columnAvailable$.subscribe(c => {
        const results = [];
        for (let i = 0; i < COLUMNS; i++) {
          results.push(true);
        }
        expect(c).toEqual(results);
      });
      component.grid$.subscribe(({ board, reset, nextPlayer }) => {
        expect(board).toEqual(new Board());
        expect(reset).toEqual(false);
        expect(nextPlayer).toEqual(Player.PLAYER1);
      });
    });
  });

  describe("strikethrough", () => {
    it("horizontal line", () => {
      component.select(1);
      component.select(0);
      component.select(2);
      component.select(0);
      component.select(3);
      component.select(0);
      component.select(4);
      fixture.detectChanges();

      component.winningSequence$.subscribe(ws => {
        expect(component.strikeThrough(ws, 0, 1, 1)).toEqual(true);
        expect(component.strikeThrough(ws, 0, 2, 1)).toEqual(true);
        expect(component.strikeThrough(ws, 0, 3, 1)).toEqual(true);
        expect(component.strikeThrough(ws, 0, 4, 1)).toEqual(true);
      });
    });

    it("vertical line", () => {
      component.select(0);
      component.select(0);
      component.select(0);
      component.select(1);
      component.select(0);
      component.select(2);
      component.select(0);
      component.select(3);
      component.select(0);
      fixture.detectChanges();

      component.winningSequence$.subscribe(ws => {
        expect(component.strikeThrough(ws, 2, 0, 7)).toEqual(true);
        expect(component.strikeThrough(ws, 3, 0, 7)).toEqual(true);
        expect(component.strikeThrough(ws, 4, 0, 7)).toEqual(true);
        expect(component.strikeThrough(ws, 5, 0, 7)).toEqual(true);
      });
    });

    it("left diagonal line", () => {
      component.select(4);
      component.select(3);
      component.select(3);
      component.select(2);
      component.select(2);
      component.select(1);
      component.select(0);
      component.select(0);
      component.select(2);
      component.select(0);
      component.select(1);
      component.select(1);
      component.select(1);
      fixture.detectChanges();

      component.winningSequence$.subscribe(ws => {
        expect(component.strikeThrough(ws, 3, 1, 6)).toEqual(true);
        expect(component.strikeThrough(ws, 2, 2, 6)).toEqual(true);
        expect(component.strikeThrough(ws, 1, 3, 6)).toEqual(true);
        expect(component.strikeThrough(ws, 0, 4, 6)).toEqual(true);
      });
    });

    it("right diagonal line", () => {
      component.select(2);
      component.select(3);
      component.select(3);
      component.select(4);
      component.select(4);
      component.select(5);
      component.select(6);
      component.select(6);
      component.select(4);
      component.select(6);
      component.select(5);
      component.select(5);
      component.select(5);
      fixture.detectChanges();

      component.winningSequence$.subscribe(ws => {
        expect(component.strikeThrough(ws, 0, 2, 8)).toEqual(true);
        expect(component.strikeThrough(ws, 1, 3, 8)).toEqual(true);
        expect(component.strikeThrough(ws, 2, 4, 8)).toEqual(true);
        expect(component.strikeThrough(ws, 3, 5, 8)).toEqual(true);
      });
    });

    it("not in winning sequence", () => {
      component.select(2);
      component.select(3);
      component.select(3);
      component.select(4);
      component.select(4);
      component.select(5);
      component.select(6);
      component.select(6);
      component.select(4);
      component.select(6);
      component.select(5);
      component.select(5);
      component.select(5);
      fixture.detectChanges();

      component.winningSequence$.subscribe(ws => {
        expect(component.strikeThrough(ws, 1, 4, 8)).toEqual(false);
      });
    });
  });

  describe("clearState in human vs human mode", () => {
    it("reset store data in human vs human", () => {
      component.select(2);
      component.select(3);
      component.select(3);
      component.select(4);
      component.select(4);
      component.select(5);
      component.select(6);
      component.select(6);
      component.select(4);
      component.select(6);
      component.select(5);
      component.select(5);
      component.select(5);

      component.clearState();
      fixture.detectChanges();

      component.lastMove$.subscribe(({ lastMove, lastMoveIdx }) => {
        expect(lastMove).toEqual(null);
        expect(lastMoveIdx).toEqual(null);
      });
      component.nextPlayer$.subscribe(({ nextPlayer }) => expect(nextPlayer).toEqual(Player.PLAYER1));
      component.winningSequence$.subscribe(({ direction, sequence, winner }) => {
        expect(direction).toEqual(null);
        expect(sequence).toEqual(null);
        expect(winner).toEqual(null);
      });
      component.moveLefts$.subscribe(num => expect(num).toBe(ROWS * COLUMNS));
      component.outcome$.subscribe(outcome => expect(outcome).toEqual(Outcome.DEFAULT));
      component.resetGame$.subscribe(reset => expect(reset).toEqual(false));
      component.columnAvailable$.subscribe(c => {
        const results = [];
        for (let i = 0; i < COLUMNS; i++) {
          results.push(true);
        }
        expect(c).toEqual(results);
      });
      component.grid$.subscribe(({ board, reset, nextPlayer }) => {
        expect(board).toEqual(new Board());
        expect(reset).toEqual(false);
        expect(nextPlayer).toEqual(Player.PLAYER1);
      });
    });
  });

  describe("clearState in human vs computer mode", () => {
    class MockSolver extends AlphabetaSolver {
      i = 0;
      dummyMoves: number[];
      constructor(dummyMoves: number[]) {
        super();
        this.dummyMoves = dummyMoves;
      }
      bestMove(board: Board): number {
        const col = this.dummyMoves[this.i];
        this.i++;
        return col;
      }
    }

    beforeEach(() => {
      component.mode = Mode.HUMAN_VS_COMPUTER;
      const mockSolver = new MockSolver([3, 4, 5, 6, 6, 5]);
      component.setTestSolver(mockSolver);
      fixture.detectChanges();
    });

    it("reset store in human vs computer", () => {
      component.select(2);
      component.select(3);
      component.select(4);
      component.select(6);
      component.select(4);
      component.select(5);
      component.select(5);

      component.clearState();
      fixture.detectChanges();

      component.lastMove$.subscribe(({ lastMove, lastMoveIdx }) => {
        expect(lastMove).toEqual(null);
        expect(lastMoveIdx).toEqual(null);
      });
      component.nextPlayer$.subscribe(({ nextPlayer }) => expect(nextPlayer).toEqual(Player.PLAYER1));
      component.winningSequence$.subscribe(({ direction, sequence, winner }) => {
        expect(direction).toEqual(null);
        expect(sequence).toEqual(null);
        expect(winner).toEqual(null);
      });
      component.moveLefts$.subscribe(num => expect(num).toBe(ROWS * COLUMNS));
      component.outcome$.subscribe(outcome => expect(outcome).toEqual(Outcome.DEFAULT));
      component.resetGame$.subscribe(reset => expect(reset).toEqual(false));
      component.columnAvailable$.subscribe(c => {
        const results = [];
        for (let i = 0; i < COLUMNS; i++) {
          results.push(true);
        }
        expect(c).toEqual(results);
      });
      component.grid$.subscribe(({ board, reset, nextPlayer }) => {
        expect(board).toEqual(new Board());
        expect(reset).toEqual(false);
        expect(nextPlayer).toEqual(Player.PLAYER1);
      });
    });
  });
});
