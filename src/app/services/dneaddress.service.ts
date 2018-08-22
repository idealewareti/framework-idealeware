import { Injectable } from '@angular/core';
import { DneAddress } from '../models/dne/dneaddress';
import { environment } from '../../environments/environment';
import { HttpClientHelper } from '../helpers/http.helper';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DneAddressService {

    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    getAddress(zipcode: string): Observable<DneAddress> {
        let url = `${environment.API_DNEADDRESS}/dneaddress/${zipcode}`;
        return this.client.get(url);
    }
}