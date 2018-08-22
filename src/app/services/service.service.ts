import { Injectable } from '@angular/core';
import { Service } from "../models/product-service/product-service";
import { HttpClientHelper } from '../helpers/http.helper';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ServiceService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    public getService(services: Service[], cep: string): Observable<Service[]> {
        let url = `${environment.API_SERVICE}/services/${cep}`;
        return this.client.post(url, services);
    }

}