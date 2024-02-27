import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { MenuManagementComponent } from './menu-management.component';
import { MenuManagementRoutingModule } from './menu-management-routing.module';
import { DataTableModule } from '../datatable/datatable.module';
import { ModalsModule } from 'src/app/_metronic/partials';
import { MenuEditSaveComponent } from './edit-save/edit-save.component';
import { ConfirmationModule } from '../confirmation/confirmation.module';
import { AlertModule } from '../alert/alert.module';

@NgModule({
  declarations: [
    MenuManagementComponent,
    MenuEditSaveComponent
  ],
  imports: [
    DataTableModule,
    ConfirmationModule,
    AlertModule,
    CommonModule,
    TranslationModule,
    MenuManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalsModule
  ],
})
export class MenuManagementModule {}
