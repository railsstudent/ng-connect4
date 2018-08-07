import { NgModule } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";

export class TestStore<T> {
  data: T;
  selectKeys: string[];

  setState(data: T) {
    this.data = data;
  }

  dispatch(action: any) {}

  selectors(...selectKeys: string[]) {
    this.selectKeys = selectKeys;
  }

  pipe(mapFn: any): Observable<T> {
    if (this.selectKeys) {
      const selectedData = this.selectKeys.reduce((acc, k) => {
        return acc[k] ? acc[k] : acc;
      }, this.data);
      return of(selectedData);
    }
    return of(null);
  }
}

@NgModule({
  providers: [{ provide: Store, useClass: TestStore }]
})
export class TestingModule {
  constructor() {}
}
