import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { ProjectModel } from "../../../models/project.model";
import { ProjectManagementService } from "../../../projects.service";
import { AlertService } from "src/app/_metronic/partials/layout/alert/alert.service";
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';

@Component({
    selector: 'app-roof-style',
    templateUrl: './roof-style.component.html',
    styleUrls: ['./roof-style.component.scss']
})
export class RoofStyleComponent implements OnInit, OnDestroy {
    @Input() project?: ProjectModel;
    @Output() isCompleted: EventEmitter<number> = new EventEmitter<number>();
    @Output() isRoofStylingStarted: EventEmitter<boolean> = new EventEmitter<boolean>();

    map: mapboxgl.Map | undefined;

    constructor(
        private projectManagementService: ProjectManagementService,
        private alertService: AlertService
    ) {
        mapboxgl.accessToken = 'pk.eyJ1Ijoia2xjc29mdCIsImEiOiJja2wyMG5vM3AxMGwxMm5sYmJtMDE3d3V5In0.vRjLvCMd7Z4J5KJQuVgfsA'
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.project) {
            if (changes.project.currentValue) {
                this.project = changes.project.currentValue;
                if (this.project?.roofGeom) {
                    let indexComa = this.project.location?.indexOf(",");
                    let lng = parseFloat(this.project.location?.substring(0, indexComa)!);
                    let lat = parseFloat(this.project.location?.substring(indexComa! + 2)!);

                    setTimeout(() => {
                        if(this.map) {
                            this.map?.remove();
                        }

                        var centroid = turf.centroid(this.project?.roofGeom.geometry);

                        this.map = new mapboxgl.Map({
                            center: [centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]],
                            zoom: 20,
                            pitch: 0,
                            bearing: 135,
                            logoPosition: 'top-right',
                            container: 'map-inner',
                            style: {
                                "version": 8,
                                "sources": {
                                    
                                },
                                "layers": [],
                                "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
                            },
                        });


                        this.map.on('load', () => {

                            this.map?.dragPan.disable();
                            this.map?.setMinZoom(20);
                            this.map?.setMaxZoom(20);
                    
                            var polygon: any = {
                                "type": "Feature",
                                "geometry": this.project?.roofGeom.geometry,
                                "properties": {
                                    "title": this.project?.roofArea + " m²"
                                }
                            };

                            this.map?.addSource('roof', {
                                'type': 'geojson',
                                'data': polygon
                            });

                            this.map?.addLayer({
                                'id': 'roof-layer',
                                'type': 'fill',
                                'source': 'roof',
                                'layout': {},
                                'paint': {
                                    'fill-color': 'lightblue',
                                    'fill-opacity': 0.5
                                }
                            });

                            this.map?.addLayer({
                                'id': 'polygon-stroke-layer',
                                'type': 'line',
                                'source': 'roof',
                                'layout': {},
                                'paint': {
                                    'line-color': 'lightblue', // Stroke color
                                    'line-width': 2 // Stroke width
                                }
                            });

                            this.map?.addLayer({
                                'id': 'text-layer',
                                'type': 'symbol',
                                'source': 'roof',
                                'layout': {
                                    'text-field':  ['get', 'title'], // Use the 'title' property for text
                                    'text-size': 16, // Text size
                                    'text-anchor': 'center', // Center the text in the middle of the polygon
                                    'text-offset': [0, 0] // Offset the text if needed
                                },
                                'paint': {
                                    'text-color': '#fff' // Text color
                                }
                            });
                        });
                    }, 500);
                }
            }
        }
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    saveSettings() {
        this.projectManagementService.edit(this.project!).subscribe(result => {
            if (result.isSuccess) {
                this.alertService.createAlert('success', result.message);
                this.isCompleted.emit(result.data.id);
            }
            else {
                this.alertService.createAlert('danger', result.message);
            }
        })
    }

    changeRoof() {
        this.isRoofStylingStarted.emit(true);
    }
}
