import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Store, StoreModule } from "@ngrx/store";
import { Mode, PieceColor, Player } from "../models";
import { AppState, reducers } from "../reducers";
import * as connectActions from "../reducers/connect.actions";
import { PlayerComponent } from "./player.component";

describe("PlayerComponent", () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  let store: Store<AppState>;

  const getName = () => fixture.debugElement.query(By.css(".name"));
  const getPiece = () => fixture.debugElement.query(By.css(".piece"));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerComponent],
      imports: [StoreModule.forRoot(reducers)]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);

    spyOn(store, "dispatch").and.callThrough();

    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    component.name = "Player 1";
    component.color = PieceColor.RED;
    component.piece = Player.PLAYER1;
    fixture.detectChanges();
  });

  it("should create Player 1", () => {
    expect(component).toBeTruthy();
    const nameDiv = getName().nativeElement as HTMLDivElement;
    expect(nameDiv.textContent).toBe("Player 1");

    const pieceDiv = getPiece().nativeElement as HTMLDivElement;
    expect(pieceDiv.style.background).toBe(PieceColor.RED);
  });

  it("should be player 1's turn when game starts", () => {
    store.dispatch(connectActions.NewGameAction({ mode: Mode.HUMAN_VS_HUMAN }));

    component.nextPlayer$.subscribe(nextPlayer => expect(nextPlayer).toEqual({ nextPlayer: Player.PLAYER1 }));
  });

  it("next move should be player 2 in human vs human", () => {
    store.dispatch(
      connectActions.PlayerOneMoveAction({
        mode: Mode.HUMAN_VS_HUMAN,
        player: Player.PLAYER1,
        column: 0
      })
    );
    component.nextPlayer$.subscribe(nextPlayer => expect(nextPlayer).toEqual({ nextPlayer: Player.PLAYER2 }));
  });

  it("next move should be player 1 in human vs human", () => {
    store.dispatch(
      connectActions.PlayerTwoMoveAction({
        player: Player.PLAYER2,
        column: 0
      })
    );
    component.nextPlayer$.subscribe(nextPlayer => expect(nextPlayer).toEqual({ nextPlayer: Player.PLAYER1 }));
  });

  it("next move should be computer in human vs computer", () => {
    store.dispatch(
      connectActions.PlayerOneMoveAction({
        mode: Mode.HUMAN_VS_COMPUTER,
        player: Player.PLAYER1,
        column: 0
      })
    );
    component.nextPlayer$.subscribe(nextPlayer => expect(nextPlayer).toEqual({ nextPlayer: Player.COMPUTER }));
  });

  it("next move should be player 1 in human vs computer", () => {
    store.dispatch(
      connectActions.ComputerMoveAction({
        player: Player.COMPUTER,
        column: 0
      })
    );
    component.nextPlayer$.subscribe(nextPlayer => expect(nextPlayer).toEqual({ nextPlayer: Player.PLAYER1 }));
  });
});
