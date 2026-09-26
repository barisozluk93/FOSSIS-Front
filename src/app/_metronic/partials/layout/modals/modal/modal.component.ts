import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { ModalConfig } from '../modal.config';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() public modalConfig?: ModalConfig;
  @ViewChild('modal') private modalContent: TemplateRef<ModalComponent>;
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  open(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const options: NgbModalOptions = {
        centered: true,
        scrollable: true,
        backdrop: true,
        keyboard: true,
        windowClass: this.modalConfig?.modalWindowClass || 'app-modal-window',
        modalDialogClass: this.modalConfig?.modalDialogClass,
        backdropClass: 'app-modal-backdrop',
      };
      this.modalRef = this.modalService.open(this.modalContent, options);
      this.modalRef.result.then(resolve, resolve);
    });
  }

  async close(): Promise<void> {
    const config = this.modalConfig;
    const modalRef = this.modalRef;
    if (!config || !modalRef) {
      return;
    }
    if (
      config.shouldClose === undefined ||
      (await config.shouldClose())
    ) {
      const result =
        config.onClose === undefined ||
        (await config.onClose());
      modalRef.close(result);
    }
  }

  async dismiss(): Promise<void> {
    const config = this.modalConfig;
    const modalRef = this.modalRef;
    if (!config || !modalRef) {
      return;
    }
    if (config.disableDismissButton?.()) {
      return;
    }

    if (
      config.shouldDismiss === undefined ||
      (await config.shouldDismiss())
    ) {
      const result =
        config.onDismiss === undefined ||
        (await config.onDismiss());
      modalRef.dismiss(result);
    }
  }

  showCloseButton(): boolean {
    return this.modalConfig?.hideCloseButton?.() !== true;
  }

  showDismissButton(): boolean {
    return this.modalConfig?.hideDismissButton?.() !== true;
  }

  showFooter(): boolean {
    return this.modalConfig?.submitCancellView !== false;
  }

  dismissButtonDisabled(): boolean {
    return this.modalConfig?.disableDismissButton?.() === true;
  }

  closeButtonDisabled(): boolean {
    return this.modalConfig?.disableCloseButton?.() === true;
  }
}
