import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnModel } from 'src/app/models/column-model';
import { PaginationModel } from 'src/app/models/pagination.model';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class DataTableComponent {
  
  @Input() header: string;
  @Input() columnList: ColumnModel[] = [];
  @Input() dataSource: any[] = [];
  @Input() totalCount = 0;
  @Input() paginationModel: PaginationModel;
  @Input() hasEditPermission = false;
  @Input() hasDeletePermission = false;
  @Input() hasNewRecordPermission = false;
  @Output() paginationModelChange: EventEmitter<PaginationModel> = new EventEmitter<PaginationModel>();
  @Output() newButtonClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() editButtonClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteButtonClick: EventEmitter<number> = new EventEmitter<number>();

  get visibleColumnCount(): number {
    const visibleColumns = (this.columnList || []).filter(column =>
      column.visibility && (column.index !== null || this.hasEditPermission || this.hasDeletePermission)
    ).length;
    return Math.max(visibleColumns, 1);
  }

  get showPagination(): boolean {
    const pageSize = Number(this.paginationModel?.pageSize);
    return Number.isFinite(pageSize) && pageSize > 0 && Number(this.totalCount) > pageSize;
  }

  openDeleteModal(id: number) {
    this.deleteButtonClick.emit(id);
  }

  openEditModal(id: number) {
    this.editButtonClick.emit(id);
  }

  openSaveModal() {
    this.newButtonClick.emit(true);
  }

  onPageChanges() {
    this.paginationModelChange.emit(this.paginationModel);
  }
}
