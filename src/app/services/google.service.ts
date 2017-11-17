import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Google } from "../models/google/google";
import { HttpClientHelper } from '../helpers/http.helper';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GoogleService {

    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getAll(): Observable<Google> {
        let url = `${environment.API_GOOGLE}/google`;
        return this.client.get(url)
            .map(res => res.json());
    }

}