import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy
} from "@angular/core";
import { Subject } from "rxjs";
import { Store, select } from "@ngrx/store";
import { AppState, selectNextPlayer } from "../../reducers";
import { Player } from "../../models";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "connect-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  @Input()
  name: string;

  @Input()
  piece: string;

  @Input()
  color: string;

  nextPlayer: Player;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store
      .pipe(select(selectNextPlayer))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(nextPlayer => {
        this.nextPlayer = nextPlayer;
        console.log("this.nextPlayer", this.nextPlayer);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
