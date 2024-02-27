import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MenuModel } from './models/menu.model';
import { ResultModel } from 'src/app/models/result.model';
import { PagingResult } from 'src/app/models/paging-result.model';

const API_MENU_URL = `${environment.apiUrl}/Menu`;

@Injectable({
    providedIn: 'root',
})
export class MenuManagementService {

    constructor(private http: HttpClient) { }

    // public methods
    all(): Observable<any> {
        return this.http.get<ResultModel<MenuModel[]>>(`${API_MENU_URL}/All`);
    }

    getMenuList(): Observable<any> {
        return this.http.get<ResultModel<MenuModel[]>>(`${API_MENU_URL}/GetMenuList`);
    }

    paging(pageNumber: number, pageSize: number): Observable<ResultModel<PagingResult<MenuModel[]>>> {
        return this.http.get<ResultModel<PagingResult<MenuModel[]>>>(`${API_MENU_URL}/Paginate`, 
            { params: new HttpParams().set("PageNumber", pageNumber).set("PageSize", pageSize) });
    }

    getById(id: number): Observable<ResultModel<MenuModel>> {
        return this.http.get<ResultModel<MenuModel>>(`${API_MENU_URL}/${id}`);
    }

    save(data: MenuModel): Observable<ResultModel<MenuModel>> {
        return this.http.post<ResultModel<MenuModel>>(`${API_MENU_URL}/Save`, data);
    }

    edit(data: MenuModel): Observable<ResultModel<MenuModel>> {
        return this.http.post<ResultModel<MenuModel>>(`${API_MENU_URL}/Update`, data);
    }

    delete(id: number): Observable<ResultModel<MenuModel[]>> {
        return this.http.delete<ResultModel<MenuModel[]>>(`${API_MENU_URL}/Delete/${id}`);
    }
}
