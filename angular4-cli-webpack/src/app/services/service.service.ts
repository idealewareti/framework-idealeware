import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '../helpers/httpclient'
import { Title } from '@angular/platform-browser';
import { AppSettings } from 'app/app.settings';
import { NgProgressService } from "ngx-progressbar";
import { Service } from "../models/product-service/product-service";
@Injectable()
export class ServiceService {
    
    constructor(
        private client: HttpClient,
        private loader: NgProgressService
    ) { }

    public getService(services: Service[], cep: string): Promise<Service[]> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_SERVICE}/services/` + cep;
            this.client.post(url, services)
                .map(res => res.json())
                .subscribe(response => {
                    let services = response.map(s => s = new Service(s));
                    resolve(services);
                }, error => reject(error));
        });
    }

}