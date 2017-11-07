import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { environment } from "../../environments/environment";
import { Store } from "../models/store/store";

@Injectable()
export class StoreService{

    constructor(private client: HttpClientHelper) {}

    /**
     * Retorna as informações da loja
     * @returns {Promise<Store>} 
     * @memberof StoreService
     */
    getStore(): Promise<Store>{
        return new Promise((resolve, reject) => {
            let url: string = `${environment.API_STORE}/store`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let store: Store = new Store().createFromResponse(response);
                resolve(store);
            }, error => {
                reject(error);
            });
        });
    }
}