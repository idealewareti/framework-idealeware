import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpClient} from '../helpers/httpclient';
import {AppSettings} from 'app/app.settings';
import {NgProgressModule} from 'ngx-progressbar';
import {Store} from '../models/store/store';

@Injectable()
export class StoreService{

    constructor(private client: HttpClient){}

    setUp(){
        if(AppSettings.DOMAIN != localStorage.getItem('store_domain'))
            localStorage.clear();
        
        localStorage.setItem('store_domain', AppSettings.DOMAIN);
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