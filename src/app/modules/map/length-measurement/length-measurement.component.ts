import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'map-lengthMeasurement',
  templateUrl: './length-measurement.component.html',
  styleUrls: ['./length-measurement.component.scss'],
})
export class LengthMeasurementComponent implements OnInit {
  
  lengthVisibility : boolean = false;
  lengthMeasure: number;

  ngOnInit(): void {
  }
  
  showPanel(lengthMeasure: number) {
    this.lengthVisibility = true;
    this.lengthMeasure = lengthMeasure;
  }

  closePanel() {
    this.lengthVisibility = false;
  }
}