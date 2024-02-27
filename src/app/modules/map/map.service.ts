import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResultModel } from 'src/app/models/result.model';
import { PagingResult } from 'src/app/models/paging-result.model';

const API_MENU_URL = `${environment.apiUrl}/Map`;

@Injectable({
    providedIn: 'root',
})
export class MapService {

    constructor(private http: HttpClient) { }

    // public methods
    
}
