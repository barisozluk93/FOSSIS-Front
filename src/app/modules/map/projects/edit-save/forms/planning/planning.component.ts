import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/_metronic/partials/layout/alert/alert.service';
import { AuthService, UserType } from 'src/app/modules/auth';
import { ProjectModel } from '../../../models/project.model';
import { ProjectManagementService } from '../../../projects.service';
import { MaterialManagementService } from 'src/app/modules/material-management/material-management.service';
import { PanelModel } from 'src/app/modules/material-management/models/panel.model';
import * as turf from '@turf/turf';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
})
export class PlanningComponent implements OnInit, AfterViewInit, OnChanges {
  form: FormGroup;

  @Output() isCompleted: EventEmitter<number> = new EventEmitter<number>();
  @Input() project?: ProjectModel;
  panels: PanelModel[] = [];

  numberOfSufficientPanel: number = 0;
  systemPower: number = 0;
  isPlanShowing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private projectManagementService: ProjectManagementService,
    private authService: AuthService,
    private alertService: AlertService,
    private materialManagementService: MaterialManagementService
  ) {

  }

  getAllPanels() {
    this.materialManagementService.allPanels().subscribe(result => {
      if (result.isSuccess) {
        this.panels = result.data;
      }
      else {
        this.panels = [];
      }
    })
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
      name: "",
      userId: undefined,
      buildingId: undefined,
      roofGeom: undefined,
      roofWkt: "",
      roofArea: undefined,
      location: "",
      panelId: [
        undefined,
        Validators.compose([
          Validators.required,
        ]),
      ],
      gridSpace: 0,
      margin: 0,
      isDeleted: false,
    });
  }

  ngAfterViewInit(): void {
    this.form.get('panelId')?.valueChanges.subscribe(newValue => {
      this.isPlanShowing = false;
      this.numberOfSufficientPanel = 0;
      this.systemPower = 0;
    });

    this.form.get('margin')?.valueChanges.subscribe(newValue => {
      this.isPlanShowing = false;
      this.numberOfSufficientPanel = 0;
      this.systemPower = 0;
    });

    this.form.get('gridSpace')?.valueChanges.subscribe(newValue => {
      this.isPlanShowing = false;
      this.numberOfSufficientPanel = 0;
      this.systemPower = 0;
    });
  }

  ngOnInit(): void {
    if (!this.form) {
      this.initForm();
    }

    this.getAllPanels();
  }

  saveSettings() {
    if (this.form.valid) {
      let data = this.form.getRawValue() as ProjectModel;
      if(!(data.gridSpace! > 0)) {
        data.gridSpace = 0;
      }

      if(!(data.margin! > 0)) {
        data.margin = 0;
      }

      this.projectManagementService.edit(data).subscribe(result => {
        if (result.isSuccess) {
          this.alertService.createAlert('success', result.message);
          this.isCompleted.emit(result.data.id);
        }
        else {
          this.alertService.createAlert('danger', result.message);
        }
      })
    }
  }

  ngOnDestroy() {
  }

  onKeyPress(event: any) {
    if (event.which != 8 && event.which != 0 && event.which < 48 || event.which > 57)
      {
        event.preventDefault();
      }
  }

  planning() {
    this.isPlanShowing = false;

    setTimeout(() => {
      let data = this.form.getRawValue();
      let selectedPanel = this.panels.filter(f => f.id == data?.panelId)[0];
      let panelArea = ((selectedPanel.length / 100) * (selectedPanel.width / 100));

      let area = data?.roofArea!;
      if(data?.margin! > 0) {
        var bufferedPolygon = turf.buffer(data?.roofGeom.geometry, -1 * (data?.margin! / 100000), { units: 'kilometers' });
        area = turf.area(bufferedPolygon);
      }

      if(data?.gridSpace! > 0) {
        if(selectedPanel.length == selectedPanel.width) {
          let effectiveArea = Math.pow((Math.sqrt(panelArea) + (data.gridSpace / 100)), 2);
          this.numberOfSufficientPanel = Math.ceil(area / effectiveArea);
          this.systemPower = (this.numberOfSufficientPanel * selectedPanel.maximumDCPower) / 1000;
        }
        else{
          let lengthWithGap = (selectedPanel.length / 100) + (data.gridSpace / 100);
          let widthWithGap = (selectedPanel.width / 100) + (data.gridSpace / 100)

          let effectiveArea = lengthWithGap * widthWithGap;
          this.numberOfSufficientPanel = Math.ceil(area / effectiveArea);
          this.systemPower = (this.numberOfSufficientPanel * selectedPanel.maximumDCPower) / 1000;
        }
      }
      else{
        this.numberOfSufficientPanel = Math.ceil(area / panelArea);
        this.systemPower = (this.numberOfSufficientPanel * selectedPanel.maximumDCPower) / 1000;
      }

      this.isPlanShowing = true;
    }, 250);
  }
}
