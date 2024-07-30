import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ColumnModel } from 'src/app/models/column-model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { UserManagementService } from '../user-management.service';
import { UserModel } from '../models/user.model';
import { UserEditSaveComponent } from './edit-save/edit-save.component';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { AlertComponent } from '../../alert/alert.component';
import { PermissionEnum } from 'src/app/enums/permission.enum';
import { AuthService } from '../../auth';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {

  @ViewChild('editSaveComponent') private editSaveComponent: UserEditSaveComponent;
  @ViewChild('confirmationComponent') private confirmationComponent: ConfirmationComponent;
  @ViewChild('alertComponent') private alertComponent: AlertComponent;

  hasEditPermission: boolean;
  hasDeletePermission: boolean;
  hasNewRecordPermission: boolean;

  constructor(private userManagementService: UserManagementService, private authService: AuthService, private translate: TranslateService) {}

  tableName: string = "Kullanıcılar";
  columnList: ColumnModel[] = [];
  columnListTr: ColumnModel[] = [
    {name: "Id", index: "id", visibility: false}, 
    {name: "Adı Soyadı", index: "nameSurname", visibility: true},
    {name: "Kullanıcı Adı", index: "username", visibility: true},
    {name: "E-posta", index: "email", visibility: true},  
    {name: "Telefon Numarası", index: "phone", visibility: true},
    {name: "Aktif Mi?", index: "isDeleted", visibility: true},  
    {name: "İşlemler", index: null, visibility: true}
  ]

  columnListEn: ColumnModel[] = [
    {name: "Id", index: "id", visibility: false}, 
    {name: "Name Surname", index: "nameSurname", visibility: true},
    {name: "Username", index: "username", visibility: true},
    {name: "E-mail", index: "email", visibility: true},  
    {name: "Phone Number", index: "phone", visibility: true},
    {name: "Is Active?", index: "isDeleted", visibility: true},  
    {name: "Actions", index: null, visibility: true}
]


  dataSource: UserModel[];
  totalCount: number;
  paginationModel: PaginationModel;

  controlPermissions() {
    this.authService.currentUserSubject.asObservable().subscribe(result => {
      if(result?.permissions)
      {
        let permissionList = (JSON.parse(result?.permissions) as number[]);

        if(permissionList.includes(PermissionEnum['UserScene.Delete.Permission'])) {
          this.hasDeletePermission = true;
        }
        else{
          this.hasDeletePermission = false;
        }

        if(permissionList.includes(PermissionEnum['UserScene.Edit.Permission'])) {
          this.hasEditPermission = true;
        }
        else{
          this.hasEditPermission = false;
        }

        if(permissionList.includes(PermissionEnum['UserScene.Save.Permission'])) {
          this.hasNewRecordPermission = true;
        }
        else{
          this.hasNewRecordPermission = false;
        }
      }
    });
  }
  
  delete(event: number) {
    this.userManagementService.userDelete(event).subscribe(result => {
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
    this.userManagementService.userPaging(this.paginationModel.pageNumber, this.paginationModel.pageSize)
          .subscribe(result => {
            if(result.isSuccess) {
              result.data.items.forEach(item => {
                item.nameSurname = item.name + " " + item.surname;
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
    this.initializeLanguageSettings()
    this.controlPermissions();
    this.paginationModel = { pageNumber: 1, pageSize: 10 } as PaginationModel;
    this.loadData();
  }

  initializeLanguageSettings (){
    this.translate.onLangChange.subscribe(() => {
      this.translate.get('USERS').subscribe((translation: string) => {
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

    this.translate.get('USERS').subscribe((translation: string) => {
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
}
