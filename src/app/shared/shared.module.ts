import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "./modal";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [ModalModule, ReactiveFormsModule],
})
export class SharedModule {}
