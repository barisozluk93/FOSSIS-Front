import { Component, Input, OnInit, ViewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { ProjectManagementService } from './projects.service';
import { ColumnModel } from 'src/app/models/column-model';
import { ProjectModel } from './models/project.model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/_metronic/partials/layout/alert/alert.service';
import { AuthService } from '../../auth';
import { PermissionEnum } from 'src/app/enums/permission.enum';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { ProjectEditSaveComponent } from './edit-save/edit-save.component';


@Component({
  selector: 'map-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  @ViewChild('confirmationComponent') confirmationComponent: ConfirmationComponent;
  @ViewChild('editSaveComponent') editSaveComponent: ProjectEditSaveComponent;

  tableName: string = "";
  columnList: ColumnModel[] = [];
  columnListTr: ColumnModel[] = [
    {name: "Id", index: "id", visibility: false}, 
    {name: "Adı", index: "name", visibility: true}, 
    {name: "Aktif Mi?", index: "isDeleted", visibility: true},    
    {name: "İşlemler", index: null, visibility: true}
  ];
  columnListEn: ColumnModel[] = [
    {name: "Id", index: "id", visibility: false}, 
    {name: "Name", index: "name", visibility: true}, 
    {name: "Is Active?", index: "isDeleted", visibility: true},    
    {name: "Actions", index: null, visibility: true}
  ];

  dataSource: ProjectModel[];
  totalCount: number;
  paginationModel: PaginationModel;

  userId: number = 0;
  hasEditPermission: boolean;
  hasDeletePermission: boolean;
  hasNewRecordPermission: boolean;

  projectVisibility : boolean = false;
  @Input() map : mapboxgl.Map;

  constructor(
    private projectManagementService: ProjectManagementService,
    private translate: TranslateService,
    private authService: AuthService, 
    private alertService: AlertService
  ) {}

  controlPermissions() {
    this.authService.currentUserSubject.asObservable().subscribe(result => {
      if(result?.permissions)
      {
        let permissionList = (JSON.parse(result?.permissions) as number[]);

        if(permissionList.includes(PermissionEnum['OrganizationScene.Delete.Permission'])) {
          this.hasDeletePermission = true;
        }
        else{
          this.hasDeletePermission = false;
        }

        if(permissionList.includes(PermissionEnum['OrganizationScene.Edit.Permission'])) {
          this.hasEditPermission = true;
        }
        else{
          this.hasEditPermission = false;
        }

        if(permissionList.includes(PermissionEnum['OrganizationScene.Save.Permission'])) {
          this.hasNewRecordPermission = true;
        }
        else{
          this.hasNewRecordPermission = false;
        }
      }
    });
  }

  delete(event: number) {
    this.projectManagementService.delete(event).subscribe(result => {
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
    this.initializeLanguageSettings();
    this.controlPermissions();
    this.loadData();
    this.projectVisibility = true;
  }

  loadData() {
    this.projectManagementService.paging(this.paginationModel.pageNumber, this.paginationModel.pageSize, this.userId, this.authService.currentUserValue?.roles.includes('1')!)
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
    if(this.authService.currentUserValue) {
      this.userId = this.authService.currentUserValue?.id;
    }

    this.initializeLanguageSettings();
    this.controlPermissions();
    this.paginationModel = { pageNumber: 1, pageSize: 5 } as PaginationModel;
    this.loadData();
  }

  initializeLanguageSettings (){
    this.translate.onLangChange.subscribe(() => {
      this.translate.get('MAP_PROJECTS').subscribe((translation: string) => {
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

    this.translate.get('MAP_PROJECTS').subscribe((translation: string) => {
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
    this.projectVisibility = false;
    this.editSaveComponent.showPanel(event);
  }

  openSaveModal(event: boolean) {
    this.projectVisibility = false;
    this.editSaveComponent.showPanel(undefined);
  }

  paginationModelChange(event: PaginationModel) {
    this.paginationModel = event;
    this.loadData();
  }
  
  showPanel() {
    this.projectVisibility = true;
  }

  closePanel() {
    this.projectVisibility = false;
  }

  
}