import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { AlertComponent } from "src/app/modules/alert/alert.component";
import { OrganizationManagementService } from "src/app/modules/organization-management/organization-management.service";
import { MaterialManagementService } from "../../material-management.service";
import { PanelModel } from "../../models/panel.model";

@Component({
    selector: 'app-panel-editsave',
    templateUrl: './edit-save.component.html',
    styleUrls: ['./edit-save.component.scss'],
})
export class PanelEditSaveComponent {

    @ViewChild('modal') private modalComponent: ModalComponent;
    @ViewChild('alertComponent') private alertComponent: AlertComponent;
    @Output() isSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

    modalConfig: ModalConfig;
    form: FormGroup;

    constructor(private fb: FormBuilder, private materialManagementService: MaterialManagementService, private organizationManagementService: OrganizationManagementService) { }

    disableSubmitButton(): boolean {
        return this.form.valid;
    }

    get f() {
        return this.form.controls;
    }

    initForm() {
        this.form = this.fb.group({
            id: 0,
            manufacturer: [
                "",
                Validators.compose([
                    Validators.required,
                ]),
            ],
            model: [
                "",
                Validators.compose([
                    Validators.required,
                ]),
            ],
            series: [
                "",
                Validators.compose([
                    Validators.required,
                ]),
            ],
            type: [
                "",
                Validators.compose([
                    Validators.required,
                ]),
            ],
            maximumDCPower: [
                undefined,
                Validators.compose([
                    Validators.required,
                ]),
            ],
            isDeleted: false,
        });
    }

    ngOnInit(): void {
        this.initForm();
    }

    openModal(panelId?: number) {

        this.modalConfig = {
            modalTitle: panelId == null ? 'New Record' : 'Edit',
            dismissButtonLabel: 'Submit',
            onDismiss: this.submit.bind(this),
            shouldDismiss: this.disableSubmitButton.bind(this),
            closeButtonLabel: 'Cancel',
        };

        if (panelId) {
            this.materialManagementService.getPanelById(panelId).subscribe(result => {
                if (result.isSuccess) {
                    this.form.patchValue(result.data);
                    this.modalComponent.open();
                }
            })
        }
        else {
            this.form.reset({ id: 0, manufacturer: "", model: "", series: "", type: "", maximumDCPower: undefined, isDeleted: false });
            this.modalComponent.open();
        }
    }

    submit() {
        if (this.form.valid) {
            var data = this.form.getRawValue() as PanelModel;

            if (data.id == 0) {
                this.materialManagementService.panelSave(data).subscribe(result => {
                    if (result.isSuccess) {
                        this.alertComponent.alert("success", result.message);
                        this.isSuccess.emit(true);
                    }
                    else {
                        this.alertComponent.alert("danger", result.message);
                    }
                })
            }
            else {
                this.materialManagementService.panelEdit(data).subscribe(result => {
                    if (result.isSuccess) {
                        this.alertComponent.alert("success", result.message);
                        this.isSuccess.emit(true);
                    }
                    else {
                        this.alertComponent.alert("danger", result.message);
                    }
                })
            }
        }

        return true;
    }
}