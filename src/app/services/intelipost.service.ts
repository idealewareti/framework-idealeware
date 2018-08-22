import { Injectable } from '@angular/core';
import { IntelipostRequest } from "../models/intelipost/intelipost-request";
import { Intelipost } from '../models/intelipost/intelipost';
import { environment } from '../../environments/environment';
import { HttpClientHelper } from '../helpers/http.helper';
import { ProductShippingModel } from '../models/product/product-shipping';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class IntelipostService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    public getShipping(request: IntelipostRequest, cartId: string): Observable<Intelipost> {
        let url = `${environment.API_INTELIPOST}/Intelipost/ByProduct/${cartId}`;
        return this.client.post(url, request)
            .pipe(map(res => res.body));
    }

    //let intelipost = (response['result']) ? new Intelipost(response.result) : new Intelipost(response);

    public getProductShipping(request: ProductShippingModel): Observable<Intelipost> {
        let url = `${environment.API_INTELIPOST}/Intelipost/Product`;
        return this.client.post(url, request)
            .pipe(map(res => res.body));
    }
}