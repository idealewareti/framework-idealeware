import { Injectable } from '@angular/core';
import { PopUp } from "../models/popup/popup";
import { HttpClientHelper } from '../helpers/http.helper';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PopUpService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    getPopUp(): Observable<PopUp> {
        const url = `${environment.API_POPUP}/popup`;
        return this.client.get(url);
    }
}