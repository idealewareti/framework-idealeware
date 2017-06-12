import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpClient} from '../helpers/httpclient'
import {Title} from '@angular/platform-browser';
import {AppSettings} from 'app/app.settings';
import {NgProgressService} from 'ngx-progressbar';
import {Brand} from '../models/brand/brand';

@Injectable()
export class BrandService{

    constructor(
        private client: HttpClient,
        private loader: NgProgressService
    ){ }

    public getAll(): Promise<Brand[]>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_BRAND}/brands`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let brands = response.map(b => new Brand(b));
                resolve(brands);

            }, error => reject(error));
        })
    }

    getBrand(id: string): Promise<Brand>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_BRAND}/brands/${id}`
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                resolve(new Brand(response));
            }, error => reject(error));
        })
    }
}