import { Component, OnInit } from "@angular/core";
import { Mode, Player, PieceColor } from "../models";
import { Store, select } from "@ngrx/store";
import { AppState, selectMode } from "../reducers";
import { ModalService } from "../shared/modal";

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

  mode$ = this.store.pipe(select(selectMode));

  constructor(private store: Store<AppState>, private modalService: ModalService) {}

  ngOnInit() {
    this.mode$.subscribe(mode => {
      this.mode = mode;
      this.isUnknown = this.mode === Mode.UNKNOWN;
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
}
