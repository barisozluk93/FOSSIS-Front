import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { OrganizationManagementService } from "../organization-management.service";
import { OrganizationModel } from "../models/organization.model";
import { AlertComponent } from "../../alert/alert.component";

@Component({
    selector: 'app-organization-editsave',
    templateUrl: './edit-save.component.html',
    styleUrls: ['./edit-save.component.scss'],
})
export class OrganizationEditSaveComponent implements OnInit{

    @ViewChild('modal') private modalComponent: ModalComponent;
    @ViewChild('alertComponent') private alertComponent: AlertComponent;
    @Output() isSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
    
    modalConfig: ModalConfig;
    form: FormGroup;
    organizations: OrganizationModel[] = [];

    constructor(private fb: FormBuilder, private organizationManagementService: OrganizationManagementService,) {}

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
            parentId: [
                null
            ],
            isDeleted: false,
        });
    }

    ngOnInit(): void {
        this.initForm();
    }
    
    openModal(organizationId?: number) {

        this.organizationManagementService.all().subscribe(result => {
            if(result.isSuccess) {
                this.organizations = result.data;
                console.log(this.organizations);
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
            this.organizationManagementService.getById(organizationId).subscribe(result => {
                if(result.isSuccess) {
                    this.form.patchValue(result.data);
                    this.modalComponent.open();
                }
            })
        }
        else{
            this.form.reset({id : 0, name: "", parentId: null, isDeleted: false});
            this.modalComponent.open();
        }
    }

    submit() {
        if(this.form.valid) {
            var data = this.form.getRawValue() as OrganizationModel;

            if(!(data.parentId! > 0)) {
                data.parentId = undefined;
            }
            
            if(data.id == 0) {
                this.organizationManagementService.save(data).subscribe(result => {
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
                this.organizationManagementService.edit(data).subscribe(result => {
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