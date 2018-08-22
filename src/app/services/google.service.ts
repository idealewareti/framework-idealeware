import { Injectable } from '@angular/core';
import { Google } from "../models/google/google";
import { HttpClientHelper } from '../helpers/http.helper';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GoogleService {

    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    getAll(): Observable<Google> {
        let url = `${environment.API_GOOGLE}/google`;
        return this.client.get(url);
    }

}