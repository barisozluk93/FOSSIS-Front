import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { DataTableModule } from '../datatable/datatable.module';
import { ModalsModule } from 'src/app/_metronic/partials';
import { ConfirmationModule } from '../confirmation/confirmation.module';
import { MaterialManagementComponent } from './material-management.component';
import { MaterialManagementRoutingModule } from './material-management-routing.module';
import { PanelComponent } from './panel/panel.component';
import { PanelEditSaveComponent } from './panel/edit-save/edit-save.component';
import { InverterComponent } from './inverter/inverter.component';
import { InverterEditSaveComponent } from './inverter/edit-save/edit-save.component';
import { BatteryComponent } from './battery/battery.component';
import { BatteryEditSaveComponent } from './battery/edit-save/edit-save.component';
import { HeatPumpComponent } from './heatpump/heatpump.component';
import { HeatPumpEditSaveComponent } from './heatpump/edit-save/edit-save.component';
import { ConstructionComponent } from './construction/construction.component';
import { ConstructionEditSaveComponent } from './construction/edit-save/edit-save.component';
import { CableComponent } from './cable/cable.component';
import { CableEditSaveComponent } from './cable/edit-save/edit-save.component';
import { ChargingStationComponent } from './chargingstation/chargingstation.component';
import { ChargingStationEditSaveComponent } from './chargingstation/edit-save/edit-save.component';

@NgModule({
  declarations: [
    MaterialManagementComponent,
    PanelComponent,
    PanelEditSaveComponent,
    InverterComponent,
    InverterEditSaveComponent,
    BatteryComponent,
    BatteryEditSaveComponent,
    HeatPumpComponent,
    HeatPumpEditSaveComponent,
    ConstructionComponent,
    ConstructionEditSaveComponent,
    CableComponent,
    CableEditSaveComponent,
    ChargingStationComponent,
    ChargingStationEditSaveComponent
  ],
  imports: [
    DataTableModule,
    ConfirmationModule,
    CommonModule,
    TranslationModule,
    MaterialManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalsModule
  ],
})
export class MaterialManagementModule {}
