import { Component, OnInit, Input } from "@angular/core";
import { Mode } from "../models";

@Component({
  selector: "connect-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit {
  @Input()
  mode: Mode;

  constructor() {}

  ngOnInit() {}
}
