import { Component, Input, OnInit, ViewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { ColumnModel } from 'src/app/models/column-model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/_metronic/partials/layout/alert/alert.service';
import { AuthService } from '../../auth';
import { PermissionEnum } from 'src/app/enums/permission.enum';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';


@Component({
  selector: 'map-project-alert',
  templateUrl: './alert-panel.component.html',
  styleUrls: ['./alert-panel.component.scss'],
})
export class AlertPanelComponent implements OnInit {

  show: boolean = false;
  message: string = "";

  ngOnInit(): void {
  }
  

  showPanel(message: string) {
    this.message = message;
    this.show = true;
  }

  closePanel() {
    this.show = false;
  }
}