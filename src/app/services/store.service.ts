import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { environment } from "../../environments/environment";
import { Store } from "../models/store/store";
import { Observable } from "rxjs/Observable";
import { Http } from "@angular/http";

@Injectable()
export class StoreService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    /**
     * Retorna as informações da loja
     * @returns {Observable<Store>} 
     * @memberof StoreService
     */
    getStore(): Observable<Store> {
        let url: string = `${environment.API_STORE}/store`;
        return this.client.get(url)
            .timeoutWith(5000, Observable.throw(new Error('Timeout!')))
            .map(res => res.json())
            .catch(error => {
                console.error(error);
                return this.getStoreFile();
            });
    }
    
    /**
     * Retorna as informações da loja, lendo o arquivo assets/services/store.json
     * @returns {Observable<Store>} 
     * @memberof StoreService
     */
    getStoreFile(error = null): Observable<Store> {
        if (error) {
            console.log(error);
        }
        let url: string = 'assets/services/store.json'
        return this.client.get(url)
            .map(res => res.json());
    }
}