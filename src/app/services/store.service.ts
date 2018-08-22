import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { environment } from "../../environments/environment";
import { Store } from "../models/store/store";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    /**
     * Retorna as informações da loja
     * @returns {Observable<Store>} 
     * @memberof StoreService
     */
    getStore(): Observable<Store> {
        let url: string = `${environment.API_STORE}/store`;
        return this.client.get(url);
    }
}