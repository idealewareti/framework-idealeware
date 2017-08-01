import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpClient} from '../helpers/httpclient'
import {Title} from '@angular/platform-browser';
import {AppSettings} from 'app/app.settings';
import {NgProgressService} from 'ngx-progressbar';
import {Banner} from '../models/banner/banner';
import {ModelReference} from '../models/model-reference';

@Injectable()
export class BannerService{

    constructor(
        private client: HttpClient,
        private loaderService: NgProgressService
    ){ }

    public getBannersFromCategory(id, type): Promise<Banner[]>{
        return this.getBanners(id, 'category', type);
    }

    public getBannersFromGroup(id, type): Promise<Banner[]>{
        return this.getBanners(id, 'group', type);
    }

    public getBannersFromBrand(id, type): Promise<Banner[]>{
        return this.getBanners(id, 'brand', type);
    }

    public getBanners(id, module, type): Promise<Banner[]>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_BANNER}/banners/${module}/${id}/${type}`;
            this.client.get(url)
                .map(res => res.json())
                .subscribe(response => {
                    resolve(response.map(b => b = new Banner(b)))
                }, error => reject(error));
        });
    }
}