import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Store } from "@ngrx/store";

import { BoardComponent } from "./board.component";
import { TestStore, TestingModule } from "../../testing/utils";
import { AppState } from "../reducers";
import { ROWS, COLUMNS, FREE_CELL, Player, Outcome, Mode } from "../models";

const initBoard = () => {
  const grid = [];
  for (let i = 0; i < ROWS * COLUMNS; i++) {
    grid.push(FREE_CELL);
  }
  return grid;
};

const initColumnAvailable = () => {
  const columns = [];
  for (let i = 0; i < COLUMNS; i++) {
    columns.push(true);
  }
  return columns;
};

fdescribe("BoardComponent", () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let store: TestStore<AppState>;

  const getBoardTitle = () =>
    fixture.debugElement.query(By.css(".board-title"));
  const getMoveLeftLabel = () =>
    fixture.debugElement.query(By.css(".move-left-label"));
  const getMoveLeftDiv = () =>
    fixture.debugElement.query(By.css(".move-left-content"));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BoardComponent],
      imports: [TestingModule]
    }).compileComponents();
  }));

  beforeEach(inject([Store], (testStore: TestStore<AppState>) => {
    store = testStore;
    const appState = {
      connect: {
        grid: initBoard(),
        nextPlayer: Player.PLAYER1,
        movesLeft: ROWS * COLUMNS,
        outcome: Outcome.DEFAULT,
        reset: false,
        columnAvailable: initColumnAvailable()
      }
    };
    store.setState(appState);
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    component.mode = Mode.HUMAN_VS_HUMAN;
  }));

  it("should create a board", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should show board title", () => {
    fixture.detectChanges();
    const span = getMoveLeftLabel().nativeElement as HTMLSpanElement;
    expect(span.textContent).toBe("Remaining Moves: ");
  });

  it("should show board moves left label and number of moves", () => {
    fixture.detectChanges();
    const p = getBoardTitle().nativeElement as HTMLParagraphElement;
    expect(p.textContent).toBe("Connect Four Game");
  });
});
