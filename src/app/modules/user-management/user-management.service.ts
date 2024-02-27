import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResultModel } from 'src/app/models/result.model';
import { PagingResult } from 'src/app/models/paging-result.model';
import { PermissionModel } from './models/permission.model';
import { RoleModel } from './models/role.model';
import { UserModel } from './models/user.model';

const API_USER_PERMISSION_URL = `${environment.apiUrl}/Permission`;
const API_USER_ROLE_URL = `${environment.apiUrl}/Role`;
const API_USER_URL = `${environment.apiUrl}/User`;

@Injectable({
    providedIn: 'root',
})
export class UserManagementService {

    constructor(private http: HttpClient) { }

    // public methods
    permissionPaging(pageNumber: number, pageSize: number): Observable<ResultModel<PagingResult<PermissionModel[]>>> {
        return this.http.get<ResultModel<PagingResult<PermissionModel[]>>>(`${API_USER_PERMISSION_URL}/Paginate`, 
            { params: new HttpParams().set("PageNumber", pageNumber).set("PageSize", pageSize) });
    }

    allPermissions(): Observable<ResultModel<PermissionModel[]>> {
        return this.http.get<ResultModel<PermissionModel[]>>(`${API_USER_PERMISSION_URL}/All`);
    }

    getPermissionById(id: number): Observable<ResultModel<PermissionModel>> {
        return this.http.get<ResultModel<PermissionModel>>(`${API_USER_PERMISSION_URL}/${id}`);
    }

    permissionSave(data: PermissionModel): Observable<ResultModel<PermissionModel>> {
        return this.http.post<ResultModel<PermissionModel>>(`${API_USER_PERMISSION_URL}/Save`, data);
    }

    permissionEdit(data: PermissionModel): Observable<ResultModel<PermissionModel>> {
        return this.http.post<ResultModel<PermissionModel>>(`${API_USER_PERMISSION_URL}/Update`, data);
    }

    permissionDelete(id: number): Observable<ResultModel<PermissionModel[]>> {
        return this.http.delete<ResultModel<PermissionModel[]>>(`${API_USER_PERMISSION_URL}/Delete/${id}`);
    }

    rolePaging(pageNumber: number, pageSize: number): Observable<ResultModel<PagingResult<RoleModel[]>>> {
        return this.http.get<ResultModel<PagingResult<RoleModel[]>>>(`${API_USER_ROLE_URL}/Paginate`, 
            { params: new HttpParams().set("PageNumber", pageNumber).set("PageSize", pageSize) });
    }

    allRoles(): Observable<ResultModel<RoleModel[]>> {
        return this.http.get<ResultModel<RoleModel[]>>(`${API_USER_ROLE_URL}/All`);
    }

    getRoleById(id: number): Observable<ResultModel<RoleModel>> {
        return this.http.get<ResultModel<RoleModel>>(`${API_USER_ROLE_URL}/${id}`);
    }

    roleSave(data: RoleModel): Observable<ResultModel<RoleModel>> {
        return this.http.post<ResultModel<RoleModel>>(`${API_USER_ROLE_URL}/Save`, data);
    }

    roleEdit(data: RoleModel): Observable<ResultModel<RoleModel>> {
        return this.http.post<ResultModel<RoleModel>>(`${API_USER_ROLE_URL}/Update`, data);
    }

    roleDelete(id: number): Observable<ResultModel<RoleModel[]>> {
        return this.http.delete<ResultModel<RoleModel[]>>(`${API_USER_ROLE_URL}/Delete/${id}`);
    }

    userPaging(pageNumber: number, pageSize: number): Observable<ResultModel<PagingResult<UserModel[]>>> {
        return this.http.get<ResultModel<PagingResult<UserModel[]>>>(`${API_USER_URL}/Paginate`, 
            { params: new HttpParams().set("PageNumber", pageNumber).set("PageSize", pageSize) });
    }

    allUsers(): Observable<ResultModel<UserModel[]>> {
        return this.http.get<ResultModel<UserModel[]>>(`${API_USER_URL}/All`);
    }

    getUserById(id: number): Observable<ResultModel<UserModel>> {
        return this.http.get<ResultModel<UserModel>>(`${API_USER_URL}/${id}`);
    }

    userSave(data: UserModel): Observable<ResultModel<UserModel>> {
        return this.http.post<ResultModel<UserModel>>(`${API_USER_URL}/Save`, data);
    }

    userEdit(data: UserModel): Observable<ResultModel<UserModel>> {
        return this.http.post<ResultModel<UserModel>>(`${API_USER_URL}/Update`, data);
    }

    userDelete(id: number): Observable<ResultModel<UserModel[]>> {
        return this.http.delete<ResultModel<UserModel[]>>(`${API_USER_URL}/Delete/${id}`);
    }
}
