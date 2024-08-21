import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { ProjectManagementService } from "../projects.service";
import { ProjectModel } from "../models/project.model";
import { MainInfosComponent } from "./forms/main-infos/main-infos.component";
import { AlertPanelComponent } from "../../alert-panel/alert-panel.component";
import mapboxDraw from '@mapbox/mapbox-gl-draw';
import { MapService } from "../../map.service";
import * as turf from '@turf/turf';
import wkt from 'terraformer-wkt-parser';
import { Polygon } from "terraformer";

type Tabs =
    | 'mainInfos'
    | 'roofStyle'
    | 'planning';

@Component({
    selector: 'map-project-editsave',
    templateUrl: './edit-save.component.html',
    styleUrls: ['./edit-save.component.scss'],
})
export class ProjectEditSaveComponent implements OnInit, OnDestroy {
    draw: mapboxDraw;

    private unsubscribe: Subscription[] = [];
    @Output() isSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() map: mapboxgl.Map;
    @ViewChild('mainInfosComponent') mainInfosComponent: MainInfosComponent;
    @ViewChild('alertComponent') alertComponent: AlertPanelComponent;

    projectEditSaveVisibility: boolean = false;
    projectId: number = 0;
    project?: ProjectModel;

    activeTab: Tabs = 'mainInfos';
    isSelectionMode: boolean = false;
    isDrawingMode: boolean = false;

    constructor(
        private projectManagementService: ProjectManagementService,
        private readonly mapService: MapService
    ) { }

    addClickEventToMap() {
        this.map.on('click', 'buildings-layer', (e: any) => {

            if (e.features.length > 0) {
                if (this.isSelectionMode && !this.isDrawingMode) {
                    this.map.setFeatureState({
                        source: 'buildings',
                        id: e.features[0].id
                    }, {
                        clicked: true
                    });

                    if(this.project?.buildingId != e.features[0].id) {
                        this.project!.roofArea = undefined;
                        this.project!.roofGeom = undefined;
                        this.project!.roofWkt = undefined;
                        this.project!.panelId = undefined;
                        this.project!.gridSpace = 0;
                        this.project!.margin = 0;
                    }

                    this.map.setFilter('buildings-layer', ['==', '$id', e.features[0].id]);
                    this.project!.buildingId = e.features[0].id;

                    var allFeatures = this.map.queryRenderedFeatures();
                    var polygon: any = allFeatures.filter(f => f.id == this.project?.buildingId)[0];
                    var centroid = turf.centroid(polygon);

                    this.project!.location = centroid.geometry.coordinates[0].toFixed(4) + ", " + centroid.geometry.coordinates[1].toFixed(4);
                    this.isSelectionMode = false;
                    this.projectEditSaveVisibility = true;

                    this.map.dragPan.disable();
                    this.map.setMinZoom(18);
                    this.map.setMaxZoom(18);
                    this.map.setZoom(18);
                    this.map.setPitch(75);
                    this.map.setBearing(130);

                    this.map.flyTo({
                        center: [e.lngLat.lng, e.lngLat.lat],
                    });

                    this.alertComponent.closePanel();
                }
            }
        })
    }

    addEscKeyPressEventToMap() {
        let subscription = fromEvent(document, 'keydown').subscribe((e: any) => {
            if (e.key == "Escape" && this instanceof ProjectEditSaveComponent) {

                if (this.isDrawingMode && this.draw) {
                    delete (this.map as any)._listeners['mousedown'];
                    delete (this.map as any)._listeners['draw.create'];

                    this.map.removeControl(this.draw);
                    this.map.removeLayer("buildings-layer-2d-shadow");
                    this.map.removeLayer("buildings-layer-2d");
                    this.map.removeSource("buildings-2d");

                    this.map.setLayoutProperty("buildings-layer", "visibility", "visible");
                }

                this.map.dragPan.disable();
                this.map.setMinZoom(18);
                this.map.setMaxZoom(18);
                this.map.setZoom(18);
                this.map.setPitch(75);
                this.map.setBearing(130);

                this.isSelectionMode = false;
                this.isDrawingMode = false;
                this.activeTab = "mainInfos";
                this.projectEditSaveVisibility = true;

                if(this.project?.roofGeom) {
                    this.project.roofWkt = this.convertToWkt();
                }

                this.alertComponent.closePanel();
            }
        });

        this.unsubscribe.push(subscription);
    }

    setTab(tab: Tabs) {
        this.activeTab = tab;

        if (this.activeTab == "roofStyle") {
            if(!this.project?.roofWkt) {
                this.projectEditSaveVisibility = false;
                this.isDrawingMode = true;
                this.isSelectionMode = false;

                this.map.setLayoutProperty("buildings-layer", 'visibility', 'none');

                this.getBuildings(this.project?.buildingId);
            }
        }
    }

    getRoof(e: any) {
        if (e.features.length > 0) {
            let area = turf.area(e.features[0]);
            let rounded_area = Math.round(area * 100) / 100;

            if (this.isDrawingMode && this.draw) {
                delete (this.map as any)._listeners['mousedown'];
                delete (this.map as any)._listeners['draw.create'];

                this.map.removeControl(this.draw);
                this.map.removeLayer("buildings-layer-2d-shadow");
                this.map.removeLayer("buildings-layer-2d");
                this.map.removeSource("buildings-2d");

                this.map.setLayoutProperty("buildings-layer", "visibility", "visible");
            }

            this.map.dragPan.disable();
            this.map.setMinZoom(18);
            this.map.setMaxZoom(18);
            this.map.setZoom(18);
            this.map.setPitch(75);
            this.map.setBearing(130);

            this.isSelectionMode = false;
            this.isDrawingMode = false;
            this.projectEditSaveVisibility = true;

            this.project!.roofArea = rounded_area;
            this.project!.roofGeom = e.features[0];
            this.project!.roofWkt = this.convertToWkt();
            this.alertComponent.closePanel();
        }


    }

    activeDisabledClass(tab: Tabs) {
        if(tab == this.activeTab) {
            return 'show active';
        }
        else{
            if(tab == 'mainInfos') {
                return '';
            }
            else if(tab == 'roofStyle') {
                if(this.projectId == 0 || !this.project?.buildingId) {
                    return 'disabled';
                }
                else{
                    return '';
                }
            }
            else{
                if(this.projectId == 0 || !this.project?.buildingId || !this.project?.roofGeom) {
                    return 'disabled';
                }
                else{
                    return '';
                }
            }
        }        
    }

    isCompleted(event: number) {
        this.projectId = event;
        this.loadProject();
    }

    isBuildingSelectionCompleted(event: boolean) {
        if (event) {
            this.alertComponent.closePanel();

            this.isSelectionMode = false;
            this.isDrawingMode = false;
            this.projectEditSaveVisibility = true;
        }
        else {
            this.addClickEventToMap();
            this.alertComponent.showPanel("Lütfen, bir lokasyon seçiniz veya iptal etmek için 'Escape' tuşuna basınız.");
            this.project = this.mainInfosComponent.form.getRawValue();

            this.isSelectionMode = true;
            this.isDrawingMode = false;
            this.projectEditSaveVisibility = false;

            if (this.project?.buildingId) {
                this.map.setFilter('buildings-layer', null);
                this.map.removeFeatureState({
                    source: 'buildings',
                    id: this.project.buildingId
                })
            }
        }
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }

    showPanel(projectId?: number) {
        this.addEscKeyPressEventToMap();
        this.activeTab = 'mainInfos';

        if (projectId) {
            this.projectId = projectId;
            this.loadProject();
        }
        else {
            this.projectId = 0;
            this.project = undefined;
        }

        this.projectEditSaveVisibility = true;
    }

    closePanel() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());

        this.map.dragPan.enable();
        this.map.setMinZoom(0);
        this.map.setMaxZoom(22);
        this.map.setZoom(17);
        this.map.setPitch(75);
        this.map.setBearing(130);
        this.map.flyTo({
            center: [28.9741, 41.0256],
        });

        if(this.project?.buildingId) {
            this.map.setFilter('buildings-layer', null);
            this.map.removeFeatureState({
                source: 'buildings',
                id: this.project.buildingId
            })
        }

        this.projectEditSaveVisibility = false;
        this.isSuccess.emit(true);
    }

    loadProject() {
        this.projectManagementService.getById(this.projectId).subscribe(result => {
            if (result.isSuccess) {
                this.project = result.data;

                if (this.project.buildingId && this.project.location) {
                    if(this.project.roofWkt) {
                        this.project.roofGeom = this.convertToGeom();
                    }

                    this.map.setFeatureState({
                        source: 'buildings',
                        id: this.project?.buildingId
                    }, {
                        clicked: true
                    });
                    
                    let indexComa = this.project.location?.indexOf(",");
                    let lng = parseFloat(this.project.location?.substring(0, indexComa)!);
                    let lat = parseFloat(this.project.location?.substring(indexComa! + 2)!);

                    this.map.setFilter('buildings-layer', ['==', '$id', this.project?.buildingId]);
                    this.map.dragPan.disable();
                    this.map.setMinZoom(18);
                    this.map.setMaxZoom(18);
                    this.map.setZoom(18);
                    this.map.setPitch(75);
                    this.map.setBearing(130);

                    this.map.flyTo({
                        center: [lng, lat],
                    });
                }
            }
        })
    }

    getBuildings(layerId: any) {
        this.mapService.getBuildings().subscribe((result: any) => {
            var geojson = JSON.parse(result);

            geojson.features.forEach((feature: any) => {
                if (feature.properties.height) {
                    feature.properties.height = parseInt(feature.properties.height);
                }
            });

            this.addBuildingsLayer(geojson, layerId);
        })
    }

    addBuildingsLayer = (content: any, layerId: any): void => {
        this.map.addSource("buildings-2d", {
            type: "geojson",
            data: content,
            generateId: true
        });

        this.map.addLayer({
            id: 'buildings-layer-2d',
            type: "fill",
            source: "buildings-2d",
            paint: {
                'fill-color': '#DFFFEA',
                'fill-opacity': 1,
            },
            filter: ['==', '$id', layerId]
        });

        this.map.addLayer({
            id: 'buildings-layer-2d-shadow',
            type: 'fill',
            source: "buildings-2d",
            paint: {
                'fill-color': 'rgba(0, 0, 0, 0.25)',  // Darker color for shadow
                'fill-translate': [3, 3]  // Offset the shadow slightly
            },
            filter: ['==', '$id', layerId]
        });

        this.draw = new mapboxDraw({
            displayControlsDefault: false,
            defaultMode: 'draw_polygon',
        });

        this.map.addControl(this.draw);
        this.map.on('draw.create', this.getRoof.bind(this));

        let indexComa = this.project?.location?.indexOf(",");
        let lng = parseFloat(this.project?.location?.substring(0, indexComa)!);
        let lat = parseFloat(this.project?.location?.substring(indexComa! + 2)!);

        this.map.on('mousedown', (e) => {
            if (e.originalEvent.button === 2) { // Check if it's the right mouse button (button === 2)
                e.preventDefault(); // Prevent the default right-click action
            }
        });
        
        this.map.dragPan.disable();
        this.map.setPitch(0);
        this.map.setZoom(20);

        this.map.flyTo({
            center: [lng, lat],
        });

        this.alertComponent.showPanel("Lütfen, binaya ait çatı modellemesini yapınız veya iptal etmek için 'Escape' tuşuna basınız.");
    }

    convertToWkt() {
        const roof = new Polygon([
            this.project?.roofGeom.geometry.coordinates[0]
        ]);

        return wkt.convert(roof); 
    }

    convertToGeom() {
        const geojson: any = wkt.parse(this.project?.roofWkt!);
        var geom = { geometry : geojson}
        return geom;
    }

    isRoofStylingStarted(event: any) {
        this.project!.roofWkt = undefined;
        this.setTab("roofStyle");
    }
}