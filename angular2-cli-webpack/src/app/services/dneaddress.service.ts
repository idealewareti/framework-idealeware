import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpClient} from '../helpers/httpclient';
import {AppSettings} from 'app/app.settings';
import {NgProgressService} from 'ngx-progressbar';
import {DneAddress} from '../models/dne/dneaddress';

@Injectable()
export class DneAddressService{
    
    constructor(
        private client: HttpClient,
        private loader: NgProgressService
    ){ }

    getAddress(zipcode: string): Promise<DneAddress>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_DNEADDRESS}/dneaddress/${zipcode}`;
            this.client.get(url)
                .map(res => res.json())
                .subscribe(response => {
                    let dneaddress = new DneAddress(response);
                    resolve(dneaddress);
                }, error => reject(error));
        });
    }
}