import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpClient} from '../helpers/httpclient'
import {Title} from '@angular/platform-browser';
import {AppSettings} from 'app/app.settings';
import {NgProgressService} from 'ngx-progressbar';
import {Institutional} from '../models/institutional/institutional';

@Injectable()
export class InstitutionalService{
    constructor(private client: HttpClient){

    }

    getAll(): Promise<Institutional[]>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_INSTITUTIONAL}/institutionals`;
            this.client.get(url)
                .map(res => res.json())
                .subscribe(response => {
                    let institutionals = response.map(i => i = new Institutional(i));
                    resolve(institutionals);
                }, error => reject(error));
        });
    }

    getById(id: string): Promise<Institutional>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_INSTITUTIONAL}/institutionals/${id}`;
            this.client.get(url)
                .map(res => res.json())
                .subscribe(response => {
                    let institutional = new Institutional(response);
                    resolve(institutional);
                }, error => reject(error));
        });
    }

    getDefault(): Promise<Institutional>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_INSTITUTIONAL}/institutionals/Default`;
             this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let institutional = new Institutional(response);
                resolve(institutional);
            }, error => reject(error));
        });
    }
}