import { StoreService } from "../services/store.service";
import { Store } from "../models/store/store";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { shareReplay } from "rxjs/operators";

const CACHE_SIZE = 1;

@Injectable({
    providedIn: 'root'
})
export class StoreManager {

    private cache$: Observable<Store>;

    constructor(private service: StoreService) { }

    /**
     * Retorna as informações da loja
     * @returns {Observable<Store>} 
     * @memberof StoreService
     */
    getStore(): Observable<Store> {
        if (!this.cache$) {
            this.cache$ = this.service.getStore().pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$;
    }
}