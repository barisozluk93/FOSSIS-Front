import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ColumnModel } from 'src/app/models/column-model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { AlertComponent } from '../../alert/alert.component';
import { PermissionEnum } from 'src/app/enums/permission.enum';
import { AuthService } from '../../auth';
import { MaterialManagementService } from '../material-management.service';
import { ConstructionEditSaveComponent } from './edit-save/edit-save.component';
import { ConstructionModel } from '../models/construction.model';

@Component({
  selector: 'app-construction',
  templateUrl: './construction.component.html',
  styleUrls: ['./construction.component.scss'],
})
export class ConstructionComponent implements OnInit, OnDestroy {

  @ViewChild('editSaveComponent') private editSaveComponent: ConstructionEditSaveComponent;
  @ViewChild('confirmationComponent') private confirmationComponent: ConfirmationComponent;
  @ViewChild('alertComponent') private alertComponent: AlertComponent;

  hasEditPermission: boolean;
  hasDeletePermission: boolean;
  hasNewRecordPermission: boolean;

  constructor(private materialManagementService: MaterialManagementService, private authService: AuthService) {}

  tableName: string = "Konstrüksiyonlar";
  columnList: ColumnModel[] = [
    {name: "Id", index: "id", visibility: false}, 
    {name: "Manufacturer", index: "manufacturer", visibility: true},
    {name: "Model", index: "model", visibility: true},
    {name: "Series", index: "series", visibility: true}, 
    {name: "Panel Orientation", index: "panelOrientation", visibility: true}, 
    {name: "Type", index: "type", visibility: true},
    {name: "Aktif Mi?", index: "isDeleted", visibility: true},  
    {name: "İşlemler", index: null, visibility: true}
  ]
  dataSource: ConstructionModel[];
  totalCount: number;
  paginationModel: PaginationModel;

  controlPermissions() {
    this.authService.currentUserSubject.asObservable().subscribe(result => {
      if(result?.permissions)
      {
        let permissionList = (JSON.parse(result?.permissions) as number[]);

        if(permissionList.includes(PermissionEnum['ConstructionScene.Delete.Permission'])) {
          this.hasDeletePermission = true;
        }
        else{
          this.hasDeletePermission = false;
        }

        if(permissionList.includes(PermissionEnum['ConstructionScene.Edit.Permission'])) {
          this.hasEditPermission = true;
        }
        else{
          this.hasEditPermission = false;
        }

        if(permissionList.includes(PermissionEnum['ConstructionScene.Save.Permission'])) {
          this.hasNewRecordPermission = true;
        }
        else{
          this.hasNewRecordPermission = false;
        }
      }
    });
  }

  delete(event: number) {
    this.materialManagementService.constructionDelete(event).subscribe(result => {
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
    this.materialManagementService.constructionPaging(this.paginationModel.pageNumber, this.paginationModel.pageSize)
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
