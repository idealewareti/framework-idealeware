import { Injectable } from '@angular/core';
import { DneAddress } from '../models/dne/dneaddress';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { HttpClientHelper } from '../helpers/http.helper';
import { Http } from '@angular/http';



@Injectable()
export class DneAddressService {
    
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getAddress(zipcode: string): Observable<DneAddress> {
        let url = `${environment.API_DNEADDRESS}/dneaddress/${zipcode}`;
        return this.client.get(url)
         .map(res => res.json())

    }
}