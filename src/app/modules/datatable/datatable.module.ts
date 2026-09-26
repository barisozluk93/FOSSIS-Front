import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationModule } from '../i18n/translation.module';
import { DataTableComponent } from './datatable.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    DataTableComponent
  ],
  exports: [
    DataTableComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    InlineSVGModule,
    NgbPaginationModule,
  ],
})
export class DataTableModule {}
