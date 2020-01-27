import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
import { Mode, Player, PieceColor } from "../models";
import { Store, select } from "@ngrx/store";
import { AppState, selectMode, selectResetGame } from "../reducers";
import { ModalService } from "../shared/modal";

const PLAYER_ONE = "Player 1";
const PLAYER_TWO = "Player 2";

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

  form: FormGroup;
  strPlayerOneName = PLAYER_ONE;
  strPlayerTwoName = PLAYER_TWO;

  mode$ = this.store.pipe(select(selectMode));

  constructor(private store: Store<AppState>, private modalService: ModalService, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      playerOneName: new FormControl(this.strPlayerOneName, { validators: [Validators.required], updateOn: "change" }),
      playerTwoName: new FormControl(this.strPlayerTwoName, { validators: [Validators.required], updateOn: "change" }),
    });

    this.mode$.subscribe(mode => {
      this.mode = mode;
      this.isUnknown = this.mode === Mode.UNKNOWN;
      this.strPlayerOneName = PLAYER_ONE;
      this.strPlayerTwoName = PLAYER_TWO;
      this.form.setValue({
        playerOneName: this.strPlayerOneName,
        playerTwoName: this.strPlayerTwoName,
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
    return this.form && (this.form.controls.playerOneName as AbstractControl);
  }

  get playerTwoName() {
    return this.form && (this.form.controls.playerTwoName as AbstractControl);
  }

  storePlayerNames(formValues: FormGroup, modalId: string) {
    if (formValues.valid) {
      const { playerOneName: strPlayerOneName, playerTwoName: strPlayerTwoName = "" } = formValues.value;
      this.strPlayerOneName = strPlayerOneName;
      this.strPlayerTwoName = !!strPlayerTwoName ? strPlayerTwoName : "Player 2";
    } else {
      this.strPlayerOneName = PLAYER_ONE;
      this.strPlayerTwoName = PLAYER_TWO;
    }
    this.modalService.close(modalId);
  }
}
