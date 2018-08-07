import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { StoreModule } from "@ngrx/store";
import { reducers, metaReducers } from "./reducers";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../environments/environment";
import { PlayerComponent } from "./player/player.component";
import { BoardComponent } from "./board/board.component";

@NgModule({
  declarations: [AppComponent, PlayerComponent, BoardComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production
      ? StoreDevtoolsModule.instrument({
          name: "NgRx Connect 4 Store DevTools",
          maxAge: 25 //  Retains last 25 states
        })
      : []
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
