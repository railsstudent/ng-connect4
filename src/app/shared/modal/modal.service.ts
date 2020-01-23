import { ModalComponent } from "./modal.component";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  private modals: ModalComponent[] = [];

  constructor() {}

  add(modal: ModalComponent) {
    this.modals.push(modal);
  }
}
