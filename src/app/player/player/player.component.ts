import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Observable } from "rxjs";
import { Store, select } from "@ngrx/store";
import { AppState, selectNextPlayer } from "../../reducers";
import { Player } from "../../models";

@Component({
  selector: "connect-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent implements OnInit {
  @Input()
  name: string;

  @Input()
  piece: string;

  @Input()
  color: string;

  nextPlayer$: Observable<Player>;

  constructor(private store: Store<AppState>) {
    this.nextPlayer$ = this.store.pipe(select(selectNextPlayer));
  }

  ngOnInit() {}
}
