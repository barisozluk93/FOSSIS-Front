import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { MapService } from './map.service';
import { BuildingInfoComponent } from './building-info/building-info.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {

  @ViewChild("buildingInfoComp") buildingInfoComp: BuildingInfoComponent;
  selectedBuildingId: number = 0;
  buildingProperties: any = null;
  
  map: mapboxgl.Map;

  lng: number = 28.9741;
  lat: number = 41.0256;
  zoom: number = 17;
  pitch: number = 75;
  bearing: number = 130;

  end: any = {
    center: [this.lng, this.lat],
        zoom: this.zoom,
        pitch: this.pitch,
        bearing: this.bearing,
  };

  constructor(private readonly mapService: MapService) {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2xjc29mdCIsImEiOiJja2wyMG5vM3AxMGwxMm5sYmJtMDE3d3V5In0.vRjLvCMd7Z4J5KJQuVgfsA'
  }

  addBuildingsLayer = (content: any): void => {
    this.map.addSource("buildings", {
      type: "geojson",
      data: content,
      generateId: true
    });

    this.map.addLayer({
      id: 'buildings-layer',
      type: "fill-extrusion",
      source: "buildings",
      // minzoom: 15,
      paint: {
        'fill-extrusion-color': [
          'case',
          ['boolean', ['feature-state', 'clicked'], false],
          '#17C653',
          '#DFFFEA'
          // '#172331',
          // '#006AE6'
        ],
        // 'fill-extrusion-height-transition': {
        //   duration: 5000,
        //   delay: 0
        // },
        'fill-extrusion-opacity': 0.75,
        'fill-extrusion-height': ["interpolate", ["linear"], ["zoom"],
          15, 0,
          15.05, ['get', 'height']]
      },
    });

    this.map.flyTo({
       ...this.end,
        duration: 12000, // Animate over 12 seconds
            essential: true 
    });

    this.map.on('click', 'buildings-layer', (e: any) => {

      if (e.features.length > 0) {

        if (this.selectedBuildingId > 0) {
          this.map.removeFeatureState({
            source: 'buildings',
            id: this.selectedBuildingId
          });
        }

        this.selectedBuildingId = e.features[0].id;

        this.map.setFeatureState({
          source: 'buildings',
          id: this.selectedBuildingId
        }, {
          clicked: true
        });
      }

      this.buildingInfoComp.showPanel(e.features[0].properties);

    })
  }

  addCss() {
    var el = document.getElementById("kt_content_container");
    var el2 = document.getElementById("kt_content");

    if (el) {
      el?.classList.add("map-container-xxl");
      el2?.classList.add("map-content");
    }
  }

  getBuildings() {
    this.mapService.getBuildings().subscribe((result: any) => {
      var geojson = JSON.parse(result);

      geojson.features.forEach((feature: any) => {
        if (feature.properties.height) {
          feature.properties.height = parseInt(feature.properties.height);
        }
      });

      this.addBuildingsLayer(geojson);
    })
  }

  ngOnInit(): void {
    this.addCss();

    setTimeout(() => {
      this.map = new mapboxgl.Map({
        container: 'map',
        // center: [this.lng, this.lat],
        // zoom: this.zoom,
        // pitch: this.pitch,
        // bearing: this.bearing,
        preserveDrawingBuffer: true,
      });

      this.map.on('load', () => {
        this.getBuildings();
      });

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
