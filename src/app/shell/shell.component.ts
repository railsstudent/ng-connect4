import { Component, OnInit } from "@angular/core";
import { Mode, Player, PieceColor } from "../models";

@Component({
  selector: "connect-shell",
  templateUrl: "./shell.component.html",
  styleUrls: ["./shell.component.scss"]
})
export class ShellComponent implements OnInit {
  _Mode = Mode;
  _Player = Player;
  _PieceColor = PieceColor;

  mode = Mode.UNKNOWN;

  constructor() {}

  ngOnInit() {}
}
