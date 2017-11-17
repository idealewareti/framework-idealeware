import { Injectable } from '@angular/core';
import { Service } from "../models/product-service/product-service";
import { HttpClientHelper } from '../helpers/http.helper';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ServiceService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    public getService(services: Service[], cep: string): Observable<Service[]> {
        let url = `${environment.API_SERVICE}/services/${cep}`;
        return this.client.post(url, services)
            .map(res => res.json());
    }

}