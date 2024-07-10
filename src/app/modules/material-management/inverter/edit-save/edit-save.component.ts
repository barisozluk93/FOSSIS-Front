import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { AlertComponent } from "src/app/modules/alert/alert.component";
import { MaterialManagementService } from "../../material-management.service";
import { InverterModel } from "../../models/inverter.model";

@Component({
    selector: 'app-inverter-editsave',
    templateUrl: './edit-save.component.html',
    styleUrls: ['./edit-save.component.scss'],
})
export class InverterEditSaveComponent implements OnInit {
    @ViewChild('modal') private modalComponent: ModalComponent;
    @ViewChild('alertComponent') private alertComponent: AlertComponent;
    @Output() isSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

    modalConfig: ModalConfig;
    form: FormGroup;

    constructor(private fb: FormBuilder, private materialManagementService: MaterialManagementService,) {}

    disableSubmitButton() : boolean {
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
            nominalACPower: [
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

    openModal(inverterId?: number) {

        this.modalConfig = {
            modalTitle: inverterId == null ? 'New Record' : 'Edit',
            dismissButtonLabel: 'Submit',
            onDismiss: this.submit.bind(this),
            shouldDismiss: this.disableSubmitButton.bind(this),
            closeButtonLabel: 'Cancel',

            
        };

        if (inverterId) {
            this.materialManagementService.getInverterById(inverterId).subscribe(result => {
                if(result.isSuccess) {
                    this.form.patchValue(result.data);
                    this.modalComponent.open();
                }
            })
        }
        else{
            this.form.reset({ id: 0, manufacturer: "", model: "", series: "", type: "", nominalACPower: undefined, isDeleted: false });
            this.modalComponent.open();
        }
    }

    submit() {
        if(this.form.valid) {
            var data = this.form.getRawValue() as InverterModel;

            if(data.id == 0) {
                this.materialManagementService.inverterSave(data).subscribe(result => {
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
                this.materialManagementService.inverterEdit(data).subscribe(result => {
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