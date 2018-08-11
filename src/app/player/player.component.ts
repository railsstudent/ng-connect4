import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AppState, selectNextPlayer } from "../reducers";

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

  nextPlayer$ = this.store.pipe(select(selectNextPlayer));

  constructor(private store: Store<AppState>) {}

  ngOnInit() {}
}
