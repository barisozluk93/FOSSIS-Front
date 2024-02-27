import { Component, Input, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';


@Component({
  selector: 'map-goToCoordinate',
  templateUrl: './gotocoordinate.component.html',
  styleUrls: ['./gotocoordinate.component.scss'],
})
export class GoToCoordinateComponent implements OnInit {
  
  goToCoordinateVisibility : boolean = false;
  longitude: number;
  latitude: number;
  @Input() map : mapboxgl.Map;

  ngOnInit(): void {
  }
  
  showPanel() {
    this.longitude = 0;
    this.latitude = 0;

    this.goToCoordinateVisibility = true;
  }

  closePanel() {
    this.goToCoordinateVisibility = false;
  }

  goToCoordinate() {
    let marker = new mapboxgl.Marker()
        .setLngLat([this.longitude, this.latitude])
        .addTo(this.map);
    
    this.map.flyTo({
        center: [this.longitude, this.latitude],
    });

    this.closePanel();
}
}