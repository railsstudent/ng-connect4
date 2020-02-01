import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Mode, Player, PieceColor } from "../models";
import { Store, select } from "@ngrx/store";
import { AppState, selectMode } from "../reducers";
import { ModalService } from "../shared/modal";

const PLAYER_ONE = "Player 1";
const PLAYER_TWO = "Player 2";
const COMPUTER = "Computer";

@Component({
  selector: "connect-shell",
  templateUrl: "./shell.component.html",
  styleUrls: ["./shell.component.scss"],
})
export class ShellComponent implements OnInit {
  _Mode = Mode;
  _Player = Player;
  _PieceColor = PieceColor;

  mode = Mode.UNKNOWN;
  isUnknown = true;

  formHuman: FormGroup;

  players = {
    playerOne: PLAYER_ONE,
    playerTwo: PLAYER_TWO,
  };

  mode$ = this.store.pipe(select(selectMode));

  constructor(private store: Store<AppState>, private modalService: ModalService, private fb: FormBuilder) {}

  ngOnInit() {
    this.formHuman = this.fb.group({
      playerOneName: new FormControl(PLAYER_ONE, { validators: [Validators.required], updateOn: "change" }),
      playerTwoName: new FormControl(PLAYER_TWO, { validators: [Validators.required], updateOn: "change" }),
      computerName: new FormControl(COMPUTER, { validators: [Validators.required], updateOn: "change" }),
    });

    this.mode$.subscribe(mode => {
      this.mode = mode;
      this.isUnknown = this.mode === Mode.UNKNOWN;
      this.formHuman.setValue({
        playerOneName: PLAYER_ONE,
        playerTwoName: PLAYER_TWO,
        computerName: COMPUTER,
      });
    });
  }

  choose(mode: Mode) {
    this.mode = mode;
    this.isUnknown = this.mode === Mode.UNKNOWN;
    if (this.mode === Mode.HUMAN_VS_HUMAN) {
      this.modalService.open("two-player-mode-dialog");
    } else if (this.mode === Mode.HUMAN_VS_COMPUTER) {
      this.modalService.open("one-player-mode-dialog");
    }
  }

  get playerOneName() {
    return this.formHuman && this.formHuman.controls && (this.formHuman.controls.playerOneName as AbstractControl);
  }

  get playerTwoName() {
    return this.formHuman && this.formHuman.controls && (this.formHuman.controls.playerTwoName as AbstractControl);
  }

  get computerName() {
    return this.formHuman && this.formHuman.controls && (this.formHuman.controls.computerName as AbstractControl);
  }

  storePlayerNames(formValues: FormGroup, modalId: string) {
    if (formValues.valid) {
      const {
        playerOneName: strPlayerOneName = "",
        playerTwoName: strPlayerTwoName = "",
        computerName: strComputerName = "",
      } = formValues.value;
      if (this.mode === Mode.HUMAN_VS_HUMAN) {
        this.players = {
          playerOne: !!strPlayerOneName ? strPlayerOneName : PLAYER_ONE,
          playerTwo: !!strPlayerTwoName ? strPlayerTwoName : PLAYER_TWO,
        };
      } else if (this.mode === Mode.HUMAN_VS_COMPUTER) {
        this.players = {
          playerOne: !!strPlayerOneName ? strPlayerOneName : PLAYER_ONE,
          playerTwo: !!strComputerName ? strComputerName : COMPUTER,
        };
      }
    } else {
      this.players = {
        playerOne: PLAYER_ONE,
        playerTwo: PLAYER_TWO,
      };
    }
    this.modalService.close(modalId);
  }
}
