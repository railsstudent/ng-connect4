import { Component, OnInit } from "@angular/core";
import { Mode, Player, PieceColor } from "../models";
import { Store, select } from "@ngrx/store";
import { AppState, selectMode } from "../reducers";

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

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.mode$.subscribe(mode => {
      this.mode = mode;
      this.isUnknown = this.mode === Mode.UNKNOWN;
    });
  }

  choose(mode: Mode) {
    this.mode = mode;
    this.isUnknown = this.mode === Mode.UNKNOWN;
  }
}
