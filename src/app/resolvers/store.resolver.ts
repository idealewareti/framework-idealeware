import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";

import { StoreManager } from "../managers/store.manager";
import { Store } from "../models/store/store";

@Injectable({
    providedIn: 'root'
})
export class StoreResolver implements Resolve<Observable<Store>>{
    constructor(
        private storeManager: StoreManager
    ) { }

    resolve(): Observable<Store> {
        return this.storeManager.getStore();
    }
}