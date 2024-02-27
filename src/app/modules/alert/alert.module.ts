import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbAlertModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownMenusModule, ModalsModule } from 'src/app/_metronic/partials';
import { AlertComponent } from './alert.component';

@NgModule({
  declarations: [
    AlertComponent
  ],
  exports: [
    AlertComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    InlineSVGModule,
    NgbAlertModule
  ],
})
export class AlertModule {}
