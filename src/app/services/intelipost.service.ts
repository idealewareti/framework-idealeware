import { Injectable } from '@angular/core';
import { IntelipostRequest } from "../models/intelipost/intelipost-request";
import { CartService } from "./cart.service";
import { Intelipost } from '../models/intelipost/intelipost';
import { environment } from '../../environments/environment';
import { HttpClientHelper } from '../helpers/http.helper';
import { Http } from '@angular/http';
import { debuglog } from 'util';
import { ProductShippingModel } from '../models/product/product-shipping';

@Injectable()
export class IntelipostService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    public getShipping(request: IntelipostRequest, cartId: string): Promise<Intelipost> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_INTELIPOST}/Intelipost/ByProduct/${cartId}`;
            this.client.post(url, request)
                .map(res => res.json())
                .subscribe(response => {
                    let intelipost = (response['result']) ? new Intelipost(response.result) : new Intelipost(response);
                    resolve(intelipost);
                }, error => reject(error));
        });
    }

    public getProductShipping(request: ProductShippingModel): Promise<Intelipost> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_INTELIPOST}/Intelipost/Product`;
            this.client.post(url, request)
                .map(res => res.json())
                .subscribe(response => {
                    let intelipost = (response['result']) ? new Intelipost(response.result) : new Intelipost(response);
                    resolve(intelipost);
                }, error => reject(error));
        });
    }
}