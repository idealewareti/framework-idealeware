import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpClient} from '../httpclient'
import {AppSettings} from '../app.settings';
import { NgProgressService } from "ngx-progressbar";
import { IntelipostRequest } from "../_models/intelipost/intelipost-request";
import { CartService } from "./cart.service";
import { Intelipost } from '../_models/intelipost/intelipost';

@Injectable()
export class IntelipostService{
    constructor(private client: HttpClient, private cartService: CartService){}

    public getShipping(request: IntelipostRequest): Promise<Intelipost>{
        return new Promise((resolve, reject) => {
            request.pageName = AppSettings.NAME;
            request.url = AppSettings.ROOT_PATH;
            request.session = this.cartService.getSessionId();

            let cartId = this.cartService.getCartId();
            if(!cartId){
                reject('Carrinho não encontrado');
            }
            else{
                let url = `${AppSettings.API_INTELIPOST}/Intelipost/ByProduct/${cartId}`;
                this.client.post(url, request)
                .map(res => res.json())
                .subscribe(response => {
                    let intelipost = new Intelipost(response.result);
                    resolve(intelipost);
                }, error => reject(error));
            }
        });
        
    }


}