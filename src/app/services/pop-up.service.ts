import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PopUp } from "../models/popup/popup";
import { HttpClientHelper } from '../helpers/http.helper';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PopUpService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getPopUp(): Observable<PopUp> {
        const url = `${environment.API_POPUP}/popup`;
        return this.client.get(url)
            .map(res => res.json());
    }
}