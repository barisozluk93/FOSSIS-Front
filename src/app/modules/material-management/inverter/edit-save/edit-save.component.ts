import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { AlertComponent } from "src/app/modules/alert/alert.component";
import { MaterialManagementService } from "../../material-management.service";

@Component({
    selector: 'app-inverter-editsave',
    templateUrl: './edit-save.component.html',
    styleUrls: ['./edit-save.component.scss'],
})
export class InverterEditSaveComponent implements OnInit {
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

    @ViewChild('modal') private modalComponent: ModalComponent;
    @ViewChild('alertComponent') private alertComponent: AlertComponent;
    @Output() isSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

    // modalConfig: ModalConfig;
    // form: FormGroup;

    // constructor(private fb: FormBuilder, private userManagementService: MaterialManagementService,) {}

    // disableSubmitButton() : boolean {
    //     return this.form.valid;
    // }

    // get f() {
    //     return this.form.controls;
    // }

    // initForm() {
    //     this.form = this.fb.group({
    //         id: 0,
    //         name: [
    //             "",
    //             Validators.compose([
    //                 Validators.required,
    //             ]),
    //         ],
    //         code: [
    //             "",
    //             Validators.compose([
    //                 Validators.required,
    //             ]),
    //         ],
    //         isDeleted: false,
    //         isSystemData: false
    //     });
    // }

    // ngOnInit(): void {
    //     this.initForm();
    // }

    // openModal(permissionId?: number) {

    //     this.modalConfig = {
    //         modalTitle: permissionId == null ? 'New Record' : 'Edit',
    //         dismissButtonLabel: 'Submit',
    //         onDismiss: this.submit.bind(this),
    //         shouldDismiss: this.disableSubmitButton.bind(this),
    //         closeButtonLabel: 'Cancel',

            
    //     };

    //     if (permissionId) {
    //         this.userManagementService.getPermissionById(permissionId).subscribe(result => {
    //             if(result.isSuccess) {
    //                 this.form.patchValue(result.data);
    //                 this.modalComponent.open();
    //             }
    //         })
    //     }
    //     else{
    //         this.form.reset({id : 0, name: "", code: "", isDeleted: false, isSystemData: false});
    //         this.modalComponent.open();
    //     }
    // }

    // submit() {
    //     if(this.form.valid) {
    //         var data = this.form.getRawValue() as PermissionModel;

    //         if(data.id == 0) {
    //             this.userManagementService.permissionSave(data).subscribe(result => {
    //                 if(result.isSuccess) {
    //                     this.alertComponent.alert("success", result.message);
    //                     this.isSuccess.emit(true);
    //                 }
    //                 else{
    //                     this.alertComponent.alert("danger", result.message);
    //                 }
    //             })
    //         }
    //         else{
    //             this.userManagementService.permissionEdit(data).subscribe(result => {
    //                 if(result.isSuccess) {
    //                     this.alertComponent.alert("success", result.message);
    //                     this.isSuccess.emit(true);
    //                 }
    //                 else{
    //                     this.alertComponent.alert("danger", result.message);
    //                 }
    //             })
    //         }
    //     }

    //     return true;
    // }
}