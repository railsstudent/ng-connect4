import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Store } from "@ngrx/store";
import { TestStore, TestingModule } from "../../../testing/utils";
import { PlayerComponent } from "./player.component";
import { AppState } from "../../reducers";
import { FREE_CELL, ROWS, COLUMNS, Player, Outcome } from "../../models";

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

fdescribe("PlayerComponent", () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  let store: TestStore<AppState>;

  const getName = () => fixture.debugElement.query(By.css(".name"));
  const getPiece = () => fixture.debugElement.query(By.css(".piece"));
  const getTurn = () => fixture.debugElement.query(By.css(".turn"));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerComponent],
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
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    component.name = "Player 1";
    component.color = "red";
    component.piece = Player.PLAYER1;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
    const nameDiv = getName().nativeElement as HTMLDivElement;
    expect(nameDiv.textContent).toBe("Player 1");

    const pieceDiv = getPiece().nativeElement as HTMLDivElement;
    expect(pieceDiv.style.background).toBe("red");

    console.log(getTurn());
  });

  // it("should show player's name", () => {
  //   const nameDiv = getName().nativeElement as HTMLDivElement;
  //   expect(nameDiv.textContent).toBe('Player 1');
  // });
});
