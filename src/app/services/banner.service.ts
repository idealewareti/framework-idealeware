import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Banner } from '../models/banner/banner';
import { ModelReference } from '../models/model-reference';
import { Observable } from "rxjs/Observable";
import { environment } from '../../environments/environment';
import { HttpClientHelper } from '../helpers/http.helper';
import { Http } from '@angular/http';


@Injectable()
export class BannerService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    public getBannersFromCategory(id, type): Observable<Banner[]> {
        return this.getBanners(id, 'category', type);
    }

    public getBannersFromGroup(id, type): Observable<Banner[]> {
        return this.getBanners(id, 'group', type);
    }

    public getBannersFromBrand(id, type): Observable<Banner[]> {
        return this.getBanners(id, 'brand', type);
    }

    public getBanners(id, module, type): Observable<Banner[]> {
        let url = `${environment.API_BANNER}/banners/${module}/${id}/${type}`;
        return this.client.get(url)
            .map(res => res.json());
    }
}