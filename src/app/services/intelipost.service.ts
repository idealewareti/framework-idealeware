import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '../helpers/httpclient'
import { AppSettings } from 'app/app.settings';
import { NgProgressService } from "ngx-progressbar";
import { IntelipostRequest } from "../models/intelipost/intelipost-request";
import { CartService } from "./cart.service";
import { Intelipost } from '../models/intelipost/intelipost';
import { Globals } from 'app/models/globals';

@Injectable()
export class IntelipostService {
    constructor(
        private client: HttpClient, 
        private cartService: CartService,
        private globals: Globals
    ) { }

    public getShipping(request: IntelipostRequest): Promise<Intelipost> {
        return new Promise((resolve, reject) => {
            request.pageName = AppSettings.NAME;
            request.url = this.globals.store.link;
            request.session = this.cartService.getSessionId();

            let cartId = this.cartService.getCartId();
            if (!cartId) {
                reject('Carrinho não encontrado');
            }
            else {
                let url = `${AppSettings.API_INTELIPOST}/Intelipost/ByProduct/${cartId}`;
                this.client.post(url, request)
                    .map(res => res.json())
                    .subscribe(response => {
                        let intelipost = (response['result']) ? new Intelipost(response.result) : new Intelipost(response);
                        resolve(intelipost);
                    }, error => reject(error));
            }
        });

    }
}