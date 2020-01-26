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

  remove(id: string) {
    this.modals = this.modals.filter(m => m.id === id);
  }

  open(id: string) {
    const modal = this.modals.find(m => m.id === id);
    if (modal) {
      modal.open();
    }
  }

  close(id: string) {
    const modal = this.modals.find(m => m.id === id);
    if (modal) {
      modal.close();
    }
  }
}
