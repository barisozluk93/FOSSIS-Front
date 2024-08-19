import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResultModel } from 'src/app/models/result.model';
import { PagingResult } from 'src/app/models/paging-result.model';
import { ProjectModel } from './models/project.model';

const API_PROJECT_URL = `${environment.apiUrl}/Project`;

@Injectable({
    providedIn: 'root',
})
export class ProjectManagementService {

    constructor(private http: HttpClient) { }

    // public methods

    paging(pageNumber: number, pageSize: number, userId: number): Observable<ResultModel<PagingResult<ProjectModel[]>>> {
        return this.http.get<ResultModel<PagingResult<ProjectModel[]>>>(`${API_PROJECT_URL}/Paginate/${userId}`, 
            { params: new HttpParams().set("PageNumber", pageNumber).set("PageSize", pageSize)});
    }

    all(): Observable<ResultModel<ProjectModel[]>> {
        return this.http.get<ResultModel<ProjectModel[]>>(`${API_PROJECT_URL}/All`);
    }

    getById(id: number): Observable<ResultModel<ProjectModel>> {
        return this.http.get<ResultModel<ProjectModel>>(`${API_PROJECT_URL}/${id}`);
    }

    save(data: ProjectModel): Observable<ResultModel<ProjectModel>> {
        return this.http.post<ResultModel<ProjectModel>>(`${API_PROJECT_URL}/Save`, data);
    }

    edit(data: ProjectModel): Observable<ResultModel<ProjectModel>> {
        return this.http.post<ResultModel<ProjectModel>>(`${API_PROJECT_URL}/Update`, data);
    }

    delete(id: number): Observable<ResultModel<ProjectModel[]>> {
        return this.http.delete<ResultModel<ProjectModel[]>>(`${API_PROJECT_URL}/Delete/${id}`);
    }
}
