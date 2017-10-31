import { Injectable}  from '@angular/core';
import { HttpClient } from '../helpers/httpclient';
import { AppSettings } from 'app/app.settings';
import { Store } from '../models/store/store';

@Injectable()
export class StoreService{

    constructor(private client: HttpClient){}

    setUp(): Promise<string>{
        return new Promise((resolve, reject) => {
            if(AppSettings.DOMAIN != localStorage.getItem('store_domain'))
                localStorage.clear();
            
            localStorage.setItem('store_domain', AppSettings.DOMAIN);
            resolve(AppSettings.DOMAIN);
        });
    }

    getInfo(): Promise<Store>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_STORE}/store`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                resolve(new Store(response));
            }, error => reject(error));
        });
    }

    
}