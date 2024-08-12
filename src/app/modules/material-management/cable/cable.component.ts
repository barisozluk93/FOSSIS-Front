import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ColumnModel } from 'src/app/models/column-model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { PermissionEnum } from 'src/app/enums/permission.enum';
import { AuthService } from '../../auth';
import { MaterialManagementService } from '../material-management.service';
import { CableEditSaveComponent } from './edit-save/edit-save.component';
import { CableModel } from '../models/cable.model';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/_metronic/partials/layout/alert/alert.service';

@Component({
  selector: 'app-cable',
  templateUrl: './cable.component.html',
  styleUrls: ['./cable.component.scss'],
})
export class CableComponent implements OnInit, OnDestroy {

  @ViewChild('editSaveComponent') private editSaveComponent: CableEditSaveComponent;
  @ViewChild('confirmationComponent') private confirmationComponent: ConfirmationComponent;

  hasEditPermission: boolean;
  hasDeletePermission: boolean;
  hasNewRecordPermission: boolean;

  constructor(
    private materialManagementService: MaterialManagementService, 
    private authService: AuthService, 
    private translate: TranslateService,
    private alertService: AlertService,
  ) {}

  tableName: string = "Kablolar";
  columnList: ColumnModel[] = [];
  columnListTr: ColumnModel[] = [
    {name: "Id", index: "id", visibility: false}, 
    {name: "Üretici", index: "manufacturer", visibility: true},
    {name: "Model", index: "model", visibility: true},
    {name: "Seri", index: "series", visibility: true},  
    {name: "Tip", index: "type", visibility: true},
    {name: "Aktif Mi?", index: "isDeleted", visibility: true},  
    {name: "İşlemler", index: null, visibility: true}
  ];
  columnListEn: ColumnModel[] = [
    {name: "Id", index: "id", visibility: false}, 
    {name: "Manufacturer", index: "manufacturer", visibility: true},
    {name: "Model", index: "model", visibility: true},
    {name: "Series", index: "series", visibility: true},  
    {name: "Type", index: "type", visibility: true},
    {name: "Is Active?", index: "isDeleted", visibility: true},  
    {name: "Actions", index: null, visibility: true}
  ];

  dataSource: CableModel[];
  totalCount: number;
  paginationModel: PaginationModel;

  searchTerm: string = '';
  lastSearchTerm: string = '';

  controlPermissions() {
    this.authService.currentUserSubject.asObservable().subscribe(result => {
      if(result?.permissions)
      {
        let permissionList = (JSON.parse(result?.permissions) as number[]);

        if(permissionList.includes(PermissionEnum['CableScene.Delete.Permission'])) {
          this.hasDeletePermission = true;
        }
        else{
          this.hasDeletePermission = false;
        }

        if(permissionList.includes(PermissionEnum['CableScene.Edit.Permission'])) {
          this.hasEditPermission = true;
        }
        else{
          this.hasEditPermission = false;
        }

        if(permissionList.includes(PermissionEnum['CableScene.Save.Permission'])) {
          this.hasNewRecordPermission = true;
        }
        else{
          this.hasNewRecordPermission = false;
        }
      }
    });
  }

  delete(event: number) {
    this.materialManagementService.cableDelete(event).subscribe(result => {
      if(result.isSuccess) {
        this.alertService.createAlert('success', result.message);
        this.loadData();
      }
      else{
        this.alertService.createAlert('danger', result.message);
      }
    })
  }

  isSuccess(event: boolean) {
    this.loadData();
  }

  loadData() {
    this.materialManagementService.cablePaging(this.paginationModel.pageNumber, this.paginationModel.pageSize, this.searchTerm)
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
    this.initializeLanguageSettings();
    this.controlPermissions();
    this.paginationModel = { pageNumber: 1, pageSize: 10 } as PaginationModel;
    this.loadData();
  }

  initializeLanguageSettings (){
    this.translate.onLangChange.subscribe(() => {
      this.translate.get('CABLES').subscribe((translation: string) => {
        this.tableName = translation;
      });
      this.translate.get('LANG').subscribe((translation: string) => {
        if(translation==="tr"){
          this.columnList=this.columnListTr
        }else{
          this.columnList=this.columnListEn
        }
      });

    });

    this.translate.get('CABLES').subscribe((translation: string) => {
      this.tableName = translation;
    });

    this.translate.get('LANG').subscribe((translation: string) => {
      if(translation==="tr"){
        this.columnList=this.columnListTr
      }else{
        this.columnList=this.columnListEn
      }
    });
  }

  ngOnDestroy() {
  }

  openDeleteModal(event: number) {
    var deleteText = "";
    this.translate.get('DELETE').subscribe((translation)=>{
      deleteText = translation;
    })
    this.confirmationComponent.openModal(deleteText, event);
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

  onSearch() {
    if (this.searchTerm === this.lastSearchTerm) {
      return;
    }
    
    this.lastSearchTerm = this.searchTerm;
    this.loadData();
  }
}
