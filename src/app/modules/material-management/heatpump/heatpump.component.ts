import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ColumnModel } from 'src/app/models/column-model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { AlertComponent } from '../../alert/alert.component';
import { PermissionEnum } from 'src/app/enums/permission.enum';
import { AuthService } from '../../auth';
import { MaterialManagementService } from '../material-management.service';
import { HeatPumpEditSaveComponent } from './edit-save/edit-save.component';
import { HeatPumpModel } from '../models/heatpump.model';

@Component({
  selector: 'app-heatpump',
  templateUrl: './heatpump.component.html',
  styleUrls: ['./heatpump.component.scss'],
})
export class HeatPumpComponent implements OnInit, OnDestroy {

  @ViewChild('editSaveComponent') private editSaveComponent: HeatPumpEditSaveComponent;
  @ViewChild('confirmationComponent') private confirmationComponent: ConfirmationComponent;
  @ViewChild('alertComponent') private alertComponent: AlertComponent;

  hasEditPermission: boolean;
  hasDeletePermission: boolean;
  hasNewRecordPermission: boolean;

  constructor(private materialManagementService: MaterialManagementService, private authService: AuthService) {}

  tableName: string = "Isı Pompaları";
  columnList: ColumnModel[] = [
    {name: "Id", index: "id", visibility: false}, 
    {name: "Manufacturer", index: "manufacturer", visibility: true},
    {name: "Model", index: "model", visibility: true},
    {name: "Type", index: "type", visibility: true},
    {name: "Structure Type", index: "structureType", visibility: true},  
    {name: "Nominal Capacity (kW)", index: "nominalCapacity", visibility: true},
    {name: "COP", index: "cop", visibility: true},
    {name: "Aktif Mi?", index: "isDeleted", visibility: true},  
    {name: "İşlemler", index: null, visibility: true}
  ]
  dataSource: HeatPumpModel[];
  totalCount: number;
  paginationModel: PaginationModel;

  controlPermissions() {
    this.authService.currentUserSubject.asObservable().subscribe(result => {
      if(result?.permissions)
      {
        let permissionList = (JSON.parse(result?.permissions) as number[]);

        if(permissionList.includes(PermissionEnum['HeatPumpScene.Delete.Permission'])) {
          this.hasDeletePermission = true;
        }
        else{
          this.hasDeletePermission = false;
        }

        if(permissionList.includes(PermissionEnum['HeatPumpScene.Edit.Permission'])) {
          this.hasEditPermission = true;
        }
        else{
          this.hasEditPermission = false;
        }

        if(permissionList.includes(PermissionEnum['HeatPumpScene.Save.Permission'])) {
          this.hasNewRecordPermission = true;
        }
        else{
          this.hasNewRecordPermission = false;
        }
      }
    });
  }

  delete(event: number) {
    this.materialManagementService.heatPumpDelete(event).subscribe(result => {
      if(result.isSuccess) {
        this.alertComponent.alert('success', result.message);
        this.loadData();
      }
      else{
        this.alertComponent.alert('danger', result.message);
      }
    })
  }

  isSuccess(event: boolean) {
    this.loadData();
  }

  loadData() {
    this.materialManagementService.heatPumpPaging(this.paginationModel.pageNumber, this.paginationModel.pageSize)
          .subscribe(result => {
            if(result.isSuccess) {
              this.dataSource = result.data.items;
              this.totalCount = result.data.totalCount;
            }
            else{
              this.dataSource = [];
              this.totalCount = 0;
            }
          })
  }

  ngOnInit(): void {
    this.controlPermissions();
    this.paginationModel = { pageNumber: 1, pageSize: 10 } as PaginationModel;
    this.loadData();
  }

  ngOnDestroy() {
  }

  openDeleteModal(event: number) {
    this.confirmationComponent.openModal('Delete', event);
  }

  openEditModal(event: number) {
    // this.editSaveComponent.openModal(event);
  }

  openSaveModal(event: boolean) {
    // this.editSaveComponent.openModal(undefined);
  }

  paginationModelChange(event: PaginationModel) {
    this.paginationModel = event;
    this.loadData();
  }
}
