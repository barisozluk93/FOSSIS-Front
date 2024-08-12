import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ColumnModel } from 'src/app/models/column-model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { PermissionEnum } from 'src/app/enums/permission.enum';
import { AuthService } from '../../auth';
import { MaterialManagementService } from '../material-management.service';
import { PanelEditSaveComponent } from './edit-save/edit-save.component';
import { PanelModel } from '../models/panel.model';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/_metronic/partials/layout/alert/alert.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit, OnDestroy {

  @ViewChild('editSaveComponent') private editSaveComponent: PanelEditSaveComponent;
  @ViewChild('confirmationComponent') private confirmationComponent: ConfirmationComponent;

  hasEditPermission: boolean;
  hasDeletePermission: boolean;
  hasNewRecordPermission: boolean;

  searchTerm: string = '';
  lastSearchTerm: string = '';

  constructor(
    private materialManagementService: MaterialManagementService, 
    private authService: AuthService, 
    private translate: TranslateService,
    private alertService: AlertService
  ) {}

  tableName: string = "";
  columnList: ColumnModel[] = [];
  columnListEn: ColumnModel[] = [
    {name: "Id", index: "id", visibility: false}, 
    {name: "Manufacturer", index: "manufacturer", visibility: true},
    {name: "Model", index: "model", visibility: true},
    {name: "Series", index: "series", visibility: true},  
    {name: "Type", index: "type", visibility: true},
    {name: "Maximum DC Power", index: "maximumDCPower", visibility: true},
    {name: "Is Active?", index: "isDeleted", visibility: true},  
    {name: "Actions", index: null, visibility: true}
  ];
  columnListTr: ColumnModel[] = [
    {name: "Id", index: "id", visibility: false}, 
    {name: "Üretici", index: "manufacturer", visibility: true},
    {name: "Model", index: "model", visibility: true},
    {name: "Seri", index: "series", visibility: true},  
    {name: "Tip", index: "type", visibility: true},
    {name: "Maksimum DC Gücü", index: "maximumDCPower", visibility: true},
    {name: "Aktif Mi?", index: "isDeleted", visibility: true},  
    {name: "İşlemler", index: null, visibility: true}
  ];

  dataSource: PanelModel[];
  totalCount: number;
  paginationModel: PaginationModel;

  controlPermissions() {
    this.authService.currentUserSubject.asObservable().subscribe(result => {
      if(result?.permissions)
      {
        let permissionList = (JSON.parse(result?.permissions) as number[]);

        if(permissionList.includes(PermissionEnum['PanelScene.Delete.Permission'])) {
          this.hasDeletePermission = true;
        }
        else{
          this.hasDeletePermission = false;
        }

        if(permissionList.includes(PermissionEnum['PanelScene.Edit.Permission'])) {
          this.hasEditPermission = true;
        }
        else{
          this.hasEditPermission = false;
        }

        if(permissionList.includes(PermissionEnum['PanelScene.Save.Permission'])) {
          this.hasNewRecordPermission = true;
        }
        else{
          this.hasNewRecordPermission = false;
        }
      }
    });
  }
  
  delete(event: number) {
    this.materialManagementService.panelDelete(event).subscribe(result => {
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
    this.materialManagementService.panelPaging(this.paginationModel.pageNumber, this.paginationModel.pageSize, this.searchTerm)
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
      this.translate.get('PANELS').subscribe((translation: string) => {
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

    this.translate.get('PANELS').subscribe((translation: string) => {
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
