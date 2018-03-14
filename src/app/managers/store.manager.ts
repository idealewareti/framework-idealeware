import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Store } from '../models/store/store';
import { TransferState, makeStateKey } from "@angular/platform-browser";
import { isPlatformBrowser } from "@angular/common";
import { AppConfig } from "../app.config";
import { StoreService } from "../services/store.service";

const STORE_MANAGER_KEY = makeStateKey('store_manager_key');

@Injectable()
export class StoreManager {

    constructor(
        private service: StoreService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private state: TransferState
    ) {
    }

    getStore(): Promise<Store> {
        return new Promise((resolve, reject) => {
            const store = this.state.get(STORE_MANAGER_KEY, null as any);
            if (store) {
                if (isPlatformBrowser(this.platformId)) {
                    sessionStorage.setItem('store', JSON.stringify(store));
                }
                resolve(store);
            } else {
                this.service
                    .getStore()
                    .subscribe(response => {
                        this.state.set(STORE_MANAGER_KEY, response as any);
                        if (isPlatformBrowser(this.platformId)) {
                            sessionStorage.setItem('store', JSON.stringify(store));
                        }
                        resolve(response);
                    }, error => {
                        reject(error);
                    });
            }

        });
    }
}