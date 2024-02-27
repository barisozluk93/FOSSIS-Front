import { Component, OnDestroy, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {

  map: mapboxgl.Map;

  lng: number = 28.9741;
  lat: number = 41.0256;
  zoom: number = 15;
  pitch: number = 69.99;
  bearing: number = -60.00;

  constructor() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2xjc29mdCIsImEiOiJja2wyMG5vM3AxMGwxMm5sYmJtMDE3d3V5In0.vRjLvCMd7Z4J5KJQuVgfsA'
  }

  addCss() {
    var el = document.getElementById("kt_content_container");
    var el2 = document.getElementById("kt_content");

    if (el) {
      el?.classList.add("map-container-xxl");
      el2?.classList.add("map-content");
    }
  }

  ngOnInit(): void {
    this.addCss();

    setTimeout(() => {
      // this.getLayerList(undefined);

      this.map = new mapboxgl.Map({
        container: 'map',
        center: [this.lng, this.lat],
        zoom: this.zoom,
        pitch: this.pitch,
        bearing: this.bearing,
        preserveDrawingBuffer: true,
      });

      // this.map.on('load', () => {
      //   this.getBuildings();
      // });

      this.map.on('move', () => {
        this.lng = + this.map.getCenter().lng.toFixed(4);
        this.lat = + this.map.getCenter().lat.toFixed(4);
        this.zoom = + this.map.getZoom().toFixed(2);
      });

      this.map.addControl(new mapboxgl.NavigationControl());


    }, 500);
  }

  ngOnDestroy() {
    var el = document.getElementById("kt_content_container");
    var el2 = document.getElementById("kt_content");

    if (el) {
      el?.classList.remove("map-container-xxl");
      el2?.classList.remove("map-content");
    }
  }

}
