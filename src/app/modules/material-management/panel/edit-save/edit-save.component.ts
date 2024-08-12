import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { OrganizationManagementService } from "src/app/modules/organization-management/organization-management.service";
import { MaterialManagementService } from "../../material-management.service";
import { PanelModel } from "../../models/panel.model";
import { forkJoin } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { AlertService } from "src/app/_metronic/partials/layout/alert/alert.service";

@Component({
    selector: 'app-panel-editsave',
    templateUrl: './edit-save.component.html',
    styleUrls: ['./edit-save.component.scss'],
})
export class PanelEditSaveComponent {

    @ViewChild('modal') private modalComponent: ModalComponent;
    @Output() isSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

    modalConfig: ModalConfig;
    form: FormGroup;

    constructor(
        private fb: FormBuilder, 
        private materialManagementService: MaterialManagementService, 
        private alertService: AlertService,
        private translate: TranslateService
    ) { }

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
        const keys = ['NEW_RECORD', 'EDIT', 'SUBMIT', 'CANCEL'];
        const translations: any = {};
        const observables = keys.map(key => this.translate.get(key));
        forkJoin(observables).subscribe((results) => {
            keys.forEach((key, index) => {
                translations[key] = results[index]
            })
        })

        this.modalConfig = {
            modalTitle: panelId == null ? translations['NEW_RECORD'] : translations['EDIT'],
            dismissButtonLabel: translations['SUBMIT'],
            onDismiss: this.submit.bind(this),
            shouldDismiss: this.disableSubmitButton.bind(this),
            closeButtonLabel: translations['CANCEL']
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
                        this.alertService.createAlert("success", result.message);
                        this.isSuccess.emit(true);
                    }
                    else {
                        this.alertService.createAlert("danger", result.message);
                    }
                })
            }
            else {
                this.materialManagementService.panelEdit(data).subscribe(result => {
                    if (result.isSuccess) {
                        this.alertService.createAlert("success", result.message);
                        this.isSuccess.emit(true);
                    }
                    else {
                        this.alertService.createAlert("danger", result.message);
                    }
                })
            }
        }

        return true;
    }
}