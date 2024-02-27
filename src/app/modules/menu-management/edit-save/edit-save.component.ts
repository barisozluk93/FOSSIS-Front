import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { AlertComponent } from "../../alert/alert.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MenuModel } from "../models/menu.model";
import { MenuManagementService } from "../menu-management.service";
import { PermissionModel } from "../../user-management/models/permission.model";
import { UserManagementService } from "../../user-management/user-management.service";

@Component({
    selector: 'app-menu-editsave',
    templateUrl: './edit-save.component.html',
    styleUrls: ['./edit-save.component.scss'],
})
export class MenuEditSaveComponent {

    @ViewChild('modal') private modalComponent: ModalComponent;
    @ViewChild('alertComponent') private alertComponent: AlertComponent;
    @Output() isSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
    
    modalConfig: ModalConfig;
    form: FormGroup;
    menus: MenuModel[] = [];
    permissions: PermissionModel[] = [];

    constructor(private fb: FormBuilder, private menuManagementService: MenuManagementService, private userManagementService: UserManagementService) {}

    disableSubmitButton() : boolean {
        return this.form.valid;
    }

    get f() {
        return this.form.controls;
    }

    initForm() {
        this.form = this.fb.group({
            id: 0,
            name: [
                "",
                Validators.compose([
                    Validators.required,
                ]),
            ],
            nameEn: [
                "",
                Validators.compose([
                    Validators.required,
                ]),
            ],
            url: [
                ""
            ],
            icon: [
                ""
            ],
            permissionId: [
                null,
                Validators.compose([
                    Validators.required,
                ]),
            ],
            parentId: [
                null
            ],
            isDeleted: false,
            isSystemData: false
        });
    }

    ngOnInit(): void {
        this.initForm();
    }
    
    openModal(organizationId?: number) {

        this.menuManagementService.all().subscribe(result => {
            if(result.isSuccess) {
                this.menus = result.data;
            }
        })

        this.userManagementService.allPermissions().subscribe(result => {
            if(result.isSuccess) {
                this.permissions = result.data;
            }
        })

        this.modalConfig = {
            modalTitle: organizationId == null ? 'New Record' : 'Edit',
            dismissButtonLabel: 'Submit',
            onDismiss: this.submit.bind(this),
            shouldDismiss: this.disableSubmitButton.bind(this),
            closeButtonLabel: 'Cancel',

            
        };

        if (organizationId) {
            this.menuManagementService.getById(organizationId).subscribe(result => {
                if(result.isSuccess) {
                    this.form.patchValue(result.data);
                    this.modalComponent.open();
                }
            })
        }
        else{
            this.form.reset({id : 0, name: "", nameEn: "", url: "", icon: "", parentId: null, isDeleted: false, isSystemData: false});
            this.modalComponent.open();
        }
    }

    submit() {
        if(this.form.valid) {
            var data = this.form.getRawValue() as MenuModel;

            if(!(data.parentId! > 0)) {
                data.parentId = undefined;
            }

            if(data.id == 0) {
                this.menuManagementService.save(data).subscribe(result => {
                    if(result.isSuccess) {
                        this.alertComponent.alert("success", result.message);
                        this.isSuccess.emit(true);
                    }
                    else{
                        this.alertComponent.alert("danger", result.message);
                    }
                })
            }
            else{
                this.menuManagementService.edit(data).subscribe(result => {
                    if(result.isSuccess) {
                        this.alertComponent.alert("success", result.message);
                        this.isSuccess.emit(true);
                    }
                    else{
                        this.alertComponent.alert("danger", result.message);
                    }
                })
            }
        }

        return true;
    }
}