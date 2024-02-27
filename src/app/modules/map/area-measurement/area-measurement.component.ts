import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'map-areaMeasurement',
  templateUrl: './area-measurement.component.html',
  styleUrls: ['./area-measurement.component.scss'],
})
export class AreaMeasurementComponent implements OnInit {
  
  areaVisibility : boolean = false;
  areaMeasure: number;

  ngOnInit(): void {
  }
  
  showPanel(areaMeasure: number) {
    this.areaVisibility = true;
    this.areaMeasure = areaMeasure;
  }

  closePanel() {
    this.areaVisibility = false;
  }
}