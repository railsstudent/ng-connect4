import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { BoardComponent, PlayerComponent, ShellComponent } from "./components";
import { metaReducers, reducers } from "./reducers";
import { SharedModule } from "./shared";

// Add an icon to the library for convenient access in other components
library.add(faArrowDown);

@NgModule({
  declarations: [AppComponent, ShellComponent, PlayerComponent, BoardComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production
      ? StoreDevtoolsModule.instrument({
          name: "NgRx Connect 4 Store DevTools",
          maxAge: 25, //  Retains last 25 states
        })
      : [],
    FontAwesomeModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
