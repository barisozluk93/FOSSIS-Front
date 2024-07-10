import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResultModel } from 'src/app/models/result.model';
import { PagingResult } from 'src/app/models/paging-result.model';
import { PanelModel } from './models/panel.model';
import { InverterModel } from './models/inverter.model';
import { HeatPumpModel } from './models/heatpump.model';
import { BatteryModel } from './models/battery.model';
import { CableModel } from './models/cable.model';
import { ConstructionModel } from './models/construction.model';
import { ChargingStationModel } from './models/chargingstation.model';

const API_MATERIAL_PANEL_URL = `${environment.apiUrl}/Panel`;
const API_MATERIAL_INVERTER_URL = `${environment.apiUrl}/Inverter`;
const API_MATERIAL_HEATPUMP_URL = `${environment.apiUrl}/HeatPump`;
const API_MATERIAL_BATTERY_URL = `${environment.apiUrl}/Battery`;
const API_MATERIAL_CABLE_URL = `${environment.apiUrl}/Cable`;
const API_MATERIAL_CONSTRUCTION_URL = `${environment.apiUrl}/Construction`;
const API_MATERIAL_CHARGINGSTATION_URL = `${environment.apiUrl}/ChargingStation`;

@Injectable({
    providedIn: 'root',
})
export class MaterialManagementService {

    constructor(private http: HttpClient) { }

    // public methods

    //Panel
    panelPaging(pageNumber: number, pageSize: number): Observable<ResultModel<PagingResult<PanelModel[]>>> {
        return this.http.get<ResultModel<PagingResult<PanelModel[]>>>(`${API_MATERIAL_PANEL_URL}/Paginate`, 
            { params: new HttpParams().set("PageNumber", pageNumber).set("PageSize", pageSize) });
    }

    allPanels(): Observable<ResultModel<PanelModel[]>> {
        return this.http.get<ResultModel<PanelModel[]>>(`${API_MATERIAL_PANEL_URL}/All`);
    }

    getPanelById(id: number): Observable<ResultModel<PanelModel>> {
        return this.http.get<ResultModel<PanelModel>>(`${API_MATERIAL_PANEL_URL}/${id}`);
    }

    panelSave(data: PanelModel): Observable<ResultModel<PanelModel>> {
        return this.http.post<ResultModel<PanelModel>>(`${API_MATERIAL_PANEL_URL}/Save`, data);
    }

    panelEdit(data: PanelModel): Observable<ResultModel<PanelModel>> {
        return this.http.post<ResultModel<PanelModel>>(`${API_MATERIAL_PANEL_URL}/Update`, data);
    }

    panelDelete(id: number): Observable<ResultModel<PanelModel[]>> {
        return this.http.delete<ResultModel<PanelModel[]>>(`${API_MATERIAL_PANEL_URL}/Delete/${id}`);
    }

    //Inverter
    inverterPaging(pageNumber: number, pageSize: number): Observable<ResultModel<PagingResult<InverterModel[]>>> {
        return this.http.get<ResultModel<PagingResult<InverterModel[]>>>(`${API_MATERIAL_INVERTER_URL}/Paginate`, 
            { params: new HttpParams().set("PageNumber", pageNumber).set("PageSize", pageSize) });
    }

    allInverters(): Observable<ResultModel<InverterModel[]>> {
        return this.http.get<ResultModel<InverterModel[]>>(`${API_MATERIAL_INVERTER_URL}/All`);
    }

    getInverterById(id: number): Observable<ResultModel<InverterModel>> {
        return this.http.get<ResultModel<InverterModel>>(`${API_MATERIAL_INVERTER_URL}/${id}`);
    }

    inverterSave(data: InverterModel): Observable<ResultModel<InverterModel>> {
        return this.http.post<ResultModel<InverterModel>>(`${API_MATERIAL_INVERTER_URL}/Save`, data);
    }

    inverterEdit(data: InverterModel): Observable<ResultModel<InverterModel>> {
        return this.http.post<ResultModel<InverterModel>>(`${API_MATERIAL_INVERTER_URL}/Update`, data);
    }

    inverterDelete(id: number): Observable<ResultModel<InverterModel[]>> {
        return this.http.delete<ResultModel<InverterModel[]>>(`${API_MATERIAL_INVERTER_URL}/Delete/${id}`);
    }

    //HeatPump
    heatPumpPaging(pageNumber: number, pageSize: number): Observable<ResultModel<PagingResult<HeatPumpModel[]>>> {
        return this.http.get<ResultModel<PagingResult<HeatPumpModel[]>>>(`${API_MATERIAL_HEATPUMP_URL}/Paginate`, 
            { params: new HttpParams().set("PageNumber", pageNumber).set("PageSize", pageSize) });
    }

    allheatPumps(): Observable<ResultModel<HeatPumpModel[]>> {
        return this.http.get<ResultModel<HeatPumpModel[]>>(`${API_MATERIAL_HEATPUMP_URL}/All`);
    }

    getHeatPumpById(id: number): Observable<ResultModel<HeatPumpModel>> {
        return this.http.get<ResultModel<HeatPumpModel>>(`${API_MATERIAL_HEATPUMP_URL}/${id}`);
    }

    heatPumpSave(data: InverterModel): Observable<ResultModel<HeatPumpModel>> {
        return this.http.post<ResultModel<HeatPumpModel>>(`${API_MATERIAL_HEATPUMP_URL}/Save`, data);
    }

    heatPumpEdit(data: InverterModel): Observable<ResultModel<HeatPumpModel>> {
        return this.http.post<ResultModel<HeatPumpModel>>(`${API_MATERIAL_HEATPUMP_URL}/Update`, data);
    }

    heatPumpDelete(id: number): Observable<ResultModel<HeatPumpModel[]>> {
        return this.http.delete<ResultModel<HeatPumpModel[]>>(`${API_MATERIAL_HEATPUMP_URL}/Delete/${id}`);
    }

    //Battery
    batteryPaging(pageNumber: number, pageSize: number): Observable<ResultModel<PagingResult<BatteryModel[]>>> {
        return this.http.get<ResultModel<PagingResult<BatteryModel[]>>>(`${API_MATERIAL_BATTERY_URL}/Paginate`, 
            { params: new HttpParams().set("PageNumber", pageNumber).set("PageSize", pageSize) });
    }

    allBatteries(): Observable<ResultModel<BatteryModel[]>> {
        return this.http.get<ResultModel<BatteryModel[]>>(`${API_MATERIAL_BATTERY_URL}/All`);
    }

    getBatteryById(id: number): Observable<ResultModel<BatteryModel>> {
        return this.http.get<ResultModel<BatteryModel>>(`${API_MATERIAL_BATTERY_URL}/${id}`);
    }

    batterySave(data: InverterModel): Observable<ResultModel<BatteryModel>> {
        return this.http.post<ResultModel<BatteryModel>>(`${API_MATERIAL_BATTERY_URL}/Save`, data);
    }

    batteryEdit(data: InverterModel): Observable<ResultModel<BatteryModel>> {
        return this.http.post<ResultModel<BatteryModel>>(`${API_MATERIAL_BATTERY_URL}/Update`, data);
    }

    batteryDelete(id: number): Observable<ResultModel<BatteryModel[]>> {
        return this.http.delete<ResultModel<BatteryModel[]>>(`${API_MATERIAL_BATTERY_URL}/Delete/${id}`);
    }

    //Cable
    cablePaging(pageNumber: number, pageSize: number): Observable<ResultModel<PagingResult<CableModel[]>>> {
        return this.http.get<ResultModel<PagingResult<CableModel[]>>>(`${API_MATERIAL_CABLE_URL}/Paginate`, 
            { params: new HttpParams().set("PageNumber", pageNumber).set("PageSize", pageSize) });
    }

    allCables(): Observable<ResultModel<CableModel[]>> {
        return this.http.get<ResultModel<CableModel[]>>(`${API_MATERIAL_CABLE_URL}/All`);
    }

    getCableById(id: number): Observable<ResultModel<CableModel>> {
        return this.http.get<ResultModel<CableModel>>(`${API_MATERIAL_CABLE_URL}/${id}`);
    }

    cableSave(data: InverterModel): Observable<ResultModel<CableModel>> {
        return this.http.post<ResultModel<CableModel>>(`${API_MATERIAL_CABLE_URL}/Save`, data);
    }

    cableEdit(data: InverterModel): Observable<ResultModel<CableModel>> {
        return this.http.post<ResultModel<CableModel>>(`${API_MATERIAL_CABLE_URL}/Update`, data);
    }

    cableDelete(id: number): Observable<ResultModel<CableModel[]>> {
        return this.http.delete<ResultModel<CableModel[]>>(`${API_MATERIAL_CABLE_URL}/Delete/${id}`);
    }

    //Construction
    constructionPaging(pageNumber: number, pageSize: number): Observable<ResultModel<PagingResult<ConstructionModel[]>>> {
        return this.http.get<ResultModel<PagingResult<ConstructionModel[]>>>(`${API_MATERIAL_CONSTRUCTION_URL}/Paginate`, 
            { params: new HttpParams().set("PageNumber", pageNumber).set("PageSize", pageSize) });
    }

    allConstructions(): Observable<ResultModel<ConstructionModel[]>> {
        return this.http.get<ResultModel<ConstructionModel[]>>(`${API_MATERIAL_CONSTRUCTION_URL}/All`);
    }

    getConstructionById(id: number): Observable<ResultModel<ConstructionModel>> {
        return this.http.get<ResultModel<ConstructionModel>>(`${API_MATERIAL_CONSTRUCTION_URL}/${id}`);
    }

    constructionSave(data: InverterModel): Observable<ResultModel<ConstructionModel>> {
        return this.http.post<ResultModel<ConstructionModel>>(`${API_MATERIAL_CONSTRUCTION_URL}/Save`, data);
    }

    constructionEdit(data: InverterModel): Observable<ResultModel<ConstructionModel>> {
        return this.http.post<ResultModel<ConstructionModel>>(`${API_MATERIAL_CONSTRUCTION_URL}/Update`, data);
    }

    constructionDelete(id: number): Observable<ResultModel<ConstructionModel[]>> {
        return this.http.delete<ResultModel<ConstructionModel[]>>(`${API_MATERIAL_CONSTRUCTION_URL}/Delete/${id}`);
    }

    //ChargingStation
    chargingStationPaging(pageNumber: number, pageSize: number): Observable<ResultModel<PagingResult<ChargingStationModel[]>>> {
        return this.http.get<ResultModel<PagingResult<ChargingStationModel[]>>>(`${API_MATERIAL_CHARGINGSTATION_URL}/Paginate`, 
            { params: new HttpParams().set("PageNumber", pageNumber).set("PageSize", pageSize) });
    }

    allChargingStations(): Observable<ResultModel<ChargingStationModel[]>> {
        return this.http.get<ResultModel<ChargingStationModel[]>>(`${API_MATERIAL_CHARGINGSTATION_URL}/All`);
    }

    getChargingStationById(id: number): Observable<ResultModel<ChargingStationModel>> {
        return this.http.get<ResultModel<ChargingStationModel>>(`${API_MATERIAL_CHARGINGSTATION_URL}/${id}`);
    }

    chargingStationSave(data: InverterModel): Observable<ResultModel<ChargingStationModel>> {
        return this.http.post<ResultModel<ChargingStationModel>>(`${API_MATERIAL_CHARGINGSTATION_URL}/Save`, data);
    }

    chargingStationEdit(data: InverterModel): Observable<ResultModel<ChargingStationModel>> {
        return this.http.post<ResultModel<ChargingStationModel>>(`${API_MATERIAL_CHARGINGSTATION_URL}/Update`, data);
    }

    chargingStationDelete(id: number): Observable<ResultModel<ChargingStationModel[]>> {
        return this.http.delete<ResultModel<ChargingStationModel[]>>(`${API_MATERIAL_CHARGINGSTATION_URL}/Delete/${id}`);
    }
}
