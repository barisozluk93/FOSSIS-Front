import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { DataTableModule } from '../datatable/datatable.module';
import { ModalsModule } from 'src/app/_metronic/partials';
import { ConfirmationModule } from '../confirmation/confirmation.module';
import { AlertModule } from '../alert/alert.module';
import { MapComponent } from './map.component';
import { MapRoutingModule } from './map-routing.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { GoToCoordinateComponent } from './go-to-coordinate/gotocoordinate.component';
import { LengthMeasurementComponent } from './length-measurement/length-measurement.component';
import { AreaMeasurementComponent } from './area-measurement/area-measurement.component';

@NgModule({
  declarations: [
    MapComponent,
    ToolbarComponent,
    GoToCoordinateComponent,
    LengthMeasurementComponent,
    AreaMeasurementComponent
  ],
  imports: [
    DataTableModule,
    ConfirmationModule,
    AlertModule,
    CommonModule,
    TranslationModule,
    MapRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalsModule,
    InlineSVGModule
  ],
})
export class MapModule {}
