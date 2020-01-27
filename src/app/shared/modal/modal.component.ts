import { DOCUMENT } from "@angular/common";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
  Inject,
  ElementRef,
  Renderer2,
  ViewEncapsulation,
  EventEmitter,
  Output,
} from "@angular/core";
import { ModalService } from "./modal.service";

@Component({
  selector: "connect-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input()
  id: string;

  private element: HTMLElement;

  constructor(
    private modalService: ModalService,
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.element = this.el.nativeElement;
  }

  ngOnInit() {
    // ensure id attribute exists
    if (!this.id) {
      console.error("modal must have an id");
      return;
    }

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    this.document.body.appendChild(this.element);

    // close modal on background click
    this.element.addEventListener("click", el => {
      const target = el.target as HTMLElement;
      if (target && target.className === "jw-modal") {
        this.close();
      }
    });

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.modalService.add(this);
  }

  open() {
    this.renderer.setStyle(this.element, "display", "block");
    this.renderer.addClass(this.document.body, "jw-modal-open");
  }

  close() {
    this.renderer.setStyle(this.element, "display", "none");
    this.renderer.removeClass(this.document.body, "jw-modal-open");
  }

  ngOnDestroy() {
    this.modalService.remove(this.id);
    this.element.remove();
  }
}
