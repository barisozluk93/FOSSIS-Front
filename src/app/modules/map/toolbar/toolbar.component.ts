import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { LayoutService } from 'src/app/_metronic/layout';
import { saveAs } from 'file-saver';
import { GoToCoordinateComponent } from '../go-to-coordinate/gotocoordinate.component';
import mapboxDraw from '@mapbox/mapbox-gl-draw';
import { LengthMeasurementComponent } from '../length-measurement/length-measurement.component';
import { AreaMeasurementComponent } from '../area-measurement/area-measurement.component';

@Component({
  selector: 'map-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

  @ViewChild("goToCoordinateComp") goToCoordinateComp: GoToCoordinateComponent;
  @ViewChild("lengthMeasurementComp") lengthMeasurementComp: LengthMeasurementComponent;
  @ViewChild("areaMeasurementComp") areaMeasurementComp: AreaMeasurementComponent;

  @Input() map : mapboxgl.Map;
  draw : mapboxDraw;

  asideCSSClasses: string;

  constructor(private layout: LayoutService,
  ) { }

  areaMeasurement(){
    if (this.draw) {
        var map = this.map as any;
        delete map._listeners['draw.create'];
        this.map.removeControl(this.draw);
    }
    this.draw = new mapboxDraw({
        displayControlsDefault: false,
        defaultMode: 'draw_polygon'
    });
    this.map.addControl(this.draw);
    this.map.on('draw.create', this.updateArea.bind(this));
  }

  exportMap() {
    this.map.getCanvas().toBlob(function (blob) {

      if(blob){
        saveAs(blob, 'map.png');
      }
    });
  }

  goToCoordinate() {
    if(this.goToCoordinateComp.goToCoordinateVisibility) {
      this.goToCoordinateComp.closePanel();
    }
    else{
      this.goToCoordinateComp.showPanel();
    }
  }

  goToHome() {
    this.map.flyTo({
      center: [34.9125, 39.2261],
      zoom: 5.7
    })
  }

  lengthMeasurement() {
    if (this.draw) {
      var map = this.map as any;
      delete map._listeners['draw.create'];
      this.map.removeControl(this.draw);
    }
    
    this.draw = new mapboxDraw({
        displayControlsDefault: false,
        defaultMode: 'draw_line_string'
    });
    
    this.map.addControl(this.draw);
    this.map.on('draw.create', this.updateLength.bind(this));
  }

  ngOnInit(): void {
    this.asideCSSClasses = this.layout.getStringCSSClasses('aside');
  }

  updateArea(e : any) {
    if (e.features.length > 0) {
        let area = turf.area(e.features[0]);
        let rounded_area = Math.round(area * 100) / 100;
        this.areaMeasurementComp.showPanel(rounded_area);
        
    }
  }

  updateLength(e: any) {
    console.log(e);
    
    if (e.features.length > 0) {
        let length = turf.length(e.features[0]);
        let rounded_length = Math.round(length * 100) / 100;
        this.lengthMeasurementComp.showPanel(rounded_length);
    }
  }


}