import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Mode } from "../models";
import { Store, select } from "@ngrx/store";
import { AppState, selectMovesLeft } from "../reducers";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "connect-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit, OnDestroy {
  @Input()
  mode: Mode;

  private unsubscribe$: Subject<void> = new Subject<void>();

  moveLefts: number;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store
      .pipe(select(selectMovesLeft))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(moveLefts => {
        this.moveLefts = moveLefts;
        console.log("this.moveLefts", this.moveLefts);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
