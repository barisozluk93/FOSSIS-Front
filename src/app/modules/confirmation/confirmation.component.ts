import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { ColumnModel } from 'src/app/models/column-model';
import { PaginationModel } from 'src/app/models/pagination.model';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit, OnDestroy {

  @ViewChild('modal') private modalComponent: ModalComponent;  
  modalConfig: ModalConfig;
  
  id: number | undefined;
  @Output() dismissButtonClick: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {

  }

  ngOnDestroy() {

  }

  openModal(title: string, id?: number) {

    this.id = id;

    this.modalConfig = {
      modalTitle: title,
      dismissButtonLabel: 'Yes',
      closeButtonLabel: 'No',
      onDismiss: this.dismissClicked.bind(this)
    }

    this.modalComponent.open();
  }

  dismissClicked() {
    this.dismissButtonClick.emit(this.id);
    return true;
  }
}
