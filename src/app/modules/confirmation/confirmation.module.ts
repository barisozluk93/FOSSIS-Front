import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownMenusModule, ModalsModule } from 'src/app/_metronic/partials';
import { ConfirmationComponent } from './confirmation.component';

@NgModule({
  declarations: [
    ConfirmationComponent
  ],
  exports: [
    ConfirmationComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    InlineSVGModule,
    ModalsModule
  ],
})
export class ConfirmationModule {}
