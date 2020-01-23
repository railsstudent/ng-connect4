import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from "@angular/core";

@Component({
  selector: "connect-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements OnInit, OnDestroy {
  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}
}
