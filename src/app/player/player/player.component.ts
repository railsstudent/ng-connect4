import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "connect-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
