import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialManagementComponent } from './material-management.component';
import { PanelComponent } from './panel/panel.component';
import { InverterComponent } from './inverter/inverter.component';
import { BatteryComponent } from './battery/battery.component';
import { HeatPumpComponent } from './heatpump/heatpump.component';
import { ConstructionComponent } from './construction/construction.component';
import { CableComponent } from './cable/cable.component';
import { ChargingStationComponent } from './chargingstation/chargingstation.component';


const routes: Routes = [
  {
    path: '',
    component: MaterialManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'panels',
        pathMatch: 'full',
      },
      {
        path: 'panels',
        component: PanelComponent,
      },
      {
        path: 'inverters',
        component: InverterComponent,
      },
      {
        path: 'batteries',
        component: BatteryComponent,
      },
      {
        path: 'heatpumps',
        component: HeatPumpComponent,
      },
      {
        path: 'constructions',
        component: ConstructionComponent,
      },
      {
        path: 'cables',
        component: CableComponent,
      },
      {
        path: 'chargingstations',
        component: ChargingStationComponent,
      },
      { path: '', redirectTo: 'panels', pathMatch: 'full' },
      { path: '**', redirectTo: 'panels', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialManagementRoutingModule {}
