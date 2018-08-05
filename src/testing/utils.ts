import { NgModule } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";

export class TestStore<T> {
  private state: BehaviorSubject<T> = new BehaviorSubject(undefined);

  setState(data: T) {
    this.state.next(data);
  }

  select(selector?: any): Observable<T> {
    return this.state.asObservable();
  }

  dispatch(action: any) {}

  pipe(selector: any) {}
}

@NgModule({
  providers: [{ provide: Store, useClass: TestStore }]
})
export class TestingModule {
  constructor() {}
}
