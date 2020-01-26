import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";

import { ShellComponent } from "./shell.component";
import { PlayerComponent } from "../player/player.component";
import { BoardComponent } from "../board/board.component";
import { reducers } from "../reducers";
import { StoreModule } from "@ngrx/store";
import { Player } from "../models";
import { ReactiveFormsModule } from "@angular/forms";

describe("ShellComponent", () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  const getTitle = () => fixture.debugElement.query(By.css(".shell-title"));
  const getHumanButton = () => fixture.debugElement.query(By.css(".btn-human"));
  const getComputerButton = () => fixture.debugElement.query(By.css(".btn-computer"));
  const getFirstPlayerComponent = () =>
    fixture.debugElement.children[0].children[0].componentInstance as PlayerComponent;
  const getBoardComponent = () => fixture.debugElement.children[0].children[1].componentInstance as BoardComponent;
  const getSecondPlayerComponent = () =>
    fixture.debugElement.children[0].children[2].componentInstance as PlayerComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShellComponent, PlayerComponent, BoardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [StoreModule.forRoot(reducers), ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show title", () => {
    expect(getTitle().nativeElement.textContent).toEqual("Enter game of Connect Four");
  });

  it("should show human vs human button", () => {
    const btn = getHumanButton().nativeElement as HTMLButtonElement;
    expect(btn.textContent).toEqual("Human vs Human");
  });

  it("should show human vs computer button", () => {
    const btn = getComputerButton().nativeElement as HTMLButtonElement;
    expect(btn.textContent).toEqual("Human vs Computer");
  });

  it("should show human vs computer button", () => {
    const btn = getComputerButton().nativeElement as HTMLButtonElement;
    expect(btn.textContent).toEqual("Human vs Computer");
  });

  it("should show players and board when human vs human button is clicked", () => {
    getHumanButton().triggerEventHandler("click", null);
    fixture.detectChanges();

    const player1 = getFirstPlayerComponent();
    const board = getBoardComponent();
    const player2 = getSecondPlayerComponent();

    expect(player1).toBeTruthy();
    expect(player1.color).toEqual("red");
    expect(player1.name).toEqual("Player 1");
    expect(player1.piece).toEqual(Player.PLAYER1);
    player1.nextPlayer$.subscribe(({ nextPlayer }) => {
      expect(nextPlayer).toEqual(Player.PLAYER1);
    });

    expect(player2).toBeTruthy();
    expect(player2.color).toEqual("yellow");
    expect(player2.name).toEqual("Player 2");
    expect(player2.piece).toEqual(Player.PLAYER2);
    player2.nextPlayer$.subscribe(({ nextPlayer }) => {
      expect(nextPlayer).toEqual(Player.PLAYER1);
    });

    expect(board).toBeTruthy();
  });

  it("should show player, computer and board when human vs computer button is clicked", () => {
    getComputerButton().triggerEventHandler("click", null);
    fixture.detectChanges();

    const player1 = getFirstPlayerComponent();
    const board = getBoardComponent();
    const player2 = getSecondPlayerComponent();

    expect(player1).toBeTruthy();
    expect(player1.color).toEqual("red");
    expect(player1.name).toEqual("Player 1");
    expect(player1.piece).toEqual(Player.PLAYER1);
    player1.nextPlayer$.subscribe(({ nextPlayer }) => {
      expect(nextPlayer).toEqual(Player.PLAYER1);
    });

    expect(player2).toBeTruthy();
    expect(player2.color).toEqual("magenta");
    expect(player2.name).toEqual("Computer");
    expect(player2.piece).toEqual(Player.COMPUTER);
    player2.nextPlayer$.subscribe(({ nextPlayer }) => {
      expect(nextPlayer).toEqual(Player.PLAYER1);
    });

    expect(board).toBeTruthy();
  });
});
