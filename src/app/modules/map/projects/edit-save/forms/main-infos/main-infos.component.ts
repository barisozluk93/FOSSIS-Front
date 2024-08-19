import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AlertService } from 'src/app/_metronic/partials/layout/alert/alert.service';
import { AuthService, UserType } from 'src/app/modules/auth';
import { UserModel } from 'src/app/modules/user-management/models/user.model';
import { UserManagementService } from 'src/app/modules/user-management/user-management.service';
import { ProjectModel } from '../../../models/project.model';
import { ProjectManagementService } from '../../../projects.service';

@Component({
  selector: 'app-main-infos',
  templateUrl: './main-infos.component.html',
})
export class MainInfosComponent implements OnInit, OnDestroy, OnChanges {
  form: FormGroup;

  @Output() isCompleted: EventEmitter<number> = new EventEmitter<number>();
  @Output() isBuildingSelectionCompleted: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() project?: ProjectModel;
  @Input() map : mapboxgl.Map;

  constructor(
    private fb: FormBuilder, 
    private projectManagementService: ProjectManagementService,
    private authService: AuthService,
    private alertService: AlertService
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.project) {
      if (!this.form) {
        this.initForm();
      }
    }

    this.form.patchValue(this.project!);
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
      userId: undefined,
      buildingId: undefined,
      location: "",
      isDeleted: false,
    });
  }

  ngOnInit(): void {
    if(!this.form) {
      this.initForm();
    }

    this.form.get("location")?.disable();
  }

  saveSettings() {
    if (this.form.valid) {
      let data = this.form.getRawValue() as ProjectModel;
      data.userId = this.authService.currentUserValue?.id;

      if(data.id == 0) {
        this.projectManagementService.save(data).subscribe(result => {
          if(result.isSuccess) {
            this.alertService.createAlert('success', result.message);
            this.isCompleted.emit(result.data.id);
          }
          else{
            this.alertService.createAlert('danger', result.message);
          }
        })
      }
      else{
        this.projectManagementService.edit(data).subscribe(result => {
          if(result.isSuccess) {
            this.alertService.createAlert('success', result.message);
            this.isCompleted.emit(result.data.id);
          }
          else{
            this.alertService.createAlert('danger', result.message);
          }
        })
      }
    }
  }

  ngOnDestroy() {
  }
  
  selectBuilding() {
    this.isBuildingSelectionCompleted.emit(false);
  }
}
