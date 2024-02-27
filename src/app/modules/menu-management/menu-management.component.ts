import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MenuManagementService } from './menu-management.service';
import { ColumnModel } from 'src/app/models/column-model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { MenuModel } from './models/menu.model';
import { MenuEditSaveComponent } from './edit-save/edit-save.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { AlertComponent } from '../alert/alert.component';
import { PermissionEnum } from 'src/app/enums/permission.enum';
import { AuthService } from '../auth';

@Component({
  selector: 'app-menu-management',
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.scss'],
})
export class MenuManagementComponent implements OnInit, OnDestroy {

  @ViewChild('editSaveComponent') private editSaveComponent: MenuEditSaveComponent;
  @ViewChild('confirmationComponent') private confirmationComponent: ConfirmationComponent;
  @ViewChild('alertComponent') private alertComponent: AlertComponent;

  hasEditPermission: boolean;
  hasDeletePermission: boolean;
  hasNewRecordPermission: boolean;

  constructor(private menuManagementService: MenuManagementService, private authService: AuthService) {}

  tableName: string = "Menüler";
  columnList: ColumnModel[] = [
    {name: "Id", index: "id", visibility: false}, 
    {name: "Adı", index: "name", visibility: true},
    {name: "İngilizce Adı", index: "nameEn", visibility: true},  
    {name: "Adres", index: "url", visibility: true},
    {name: "Üst Menü Adı", index: "parentName", visibility: true},
    {name: "Aktif Mi?", index: "isDeleted", visibility: true},  
    {name: "İşlemler", index: null, visibility: true}
  ]
  dataSource: MenuModel[];
  totalCount: number;
  paginationModel: PaginationModel;

  controlPermissions() {
    this.authService.currentUserSubject.asObservable().subscribe(result => {
      if(result?.permissions)
      {
        let permissionList = (JSON.parse(result?.permissions) as number[]);

        if(permissionList.includes(PermissionEnum['MenuScene.Delete.Permission'])) {
          this.hasDeletePermission = true;
        }
        else{
          this.hasDeletePermission = false;
        }

        if(permissionList.includes(PermissionEnum['MenuScene.Edit.Permission'])) {
          this.hasEditPermission = true;
        }
        else{
          this.hasEditPermission = false;
        }

        if(permissionList.includes(PermissionEnum['MenuScene.Save.Permission'])) {
          this.hasNewRecordPermission = true;
        }
        else{
          this.hasNewRecordPermission = false;
        }
      }
    });
  }
  
  delete(event: number) {
    this.menuManagementService.delete(event).subscribe(result => {
      if(result.isSuccess) {
        this.alertComponent.alert('success', result.message);
        this.loadData();

        setTimeout(() => {
          this.menuManagementService.getMenuList().subscribe(result => {
            localStorage.setItem("menu", JSON.stringify(result.data));

            document.location.reload();
          })
        }, 250)
      }
      else{
        this.alertComponent.alert('danger', result.message);
      }
    })
  }

  isSuccess(event: boolean) {
    this.loadData();

    setTimeout(() => {
      this.menuManagementService.getMenuList().subscribe(result => {
        localStorage.setItem("menu", JSON.stringify(result.data));

        document.location.reload();
      })
    }, 250)
  }

  loadData() {
    this.menuManagementService.paging(this.paginationModel.pageNumber, this.paginationModel.pageSize)
          .subscribe(result => {
            if(result.isSuccess) {
              result.data.items.forEach(item => {
                item.parentName = item.parent ? item.parent.name : '';
              })
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
    this.editSaveComponent.openModal(event);
  }

  openSaveModal(event: boolean) {
    this.editSaveComponent.openModal(undefined);
  }

  paginationModelChange(event: PaginationModel) {
    this.paginationModel = event;
    this.loadData();
  }
}
