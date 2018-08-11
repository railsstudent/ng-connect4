import { TestBed, async } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { PlayerComponent } from "./player/player.component";
import { BoardComponent } from "./board/board.component";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { reducers } from "./reducers";
import { StoreModule } from "@ngrx/store";

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, PlayerComponent, BoardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [StoreModule.forRoot(reducers)]
    }).compileComponents();
  }));
  it("should create the app", async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  //   // it(`should have as title 'connect'`, async(() => {
  //   //   const fixture = TestBed.createComponent(AppComponent);
  //   //   const app = fixture.debugElement.componentInstance;
  //   //   expect(app.title).toEqual('connect');
  //   // }));
  //   // it('should render title in a h1 tag', async(() => {
  //   //   const fixture = TestBed.createComponent(AppComponent);
  //   //   fixture.detectChanges();
  //   //   const compiled = fixture.debugElement.nativeElement;
  //   //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to connect!');
  //   // }));
});
