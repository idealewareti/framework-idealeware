import { Injectable } from '@angular/core';
import { Banner } from '../models/banner/banner';
import { environment } from '../../environments/environment';
import { HttpClientHelper } from '../helpers/http.helper';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class BannerService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
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
        return this.client.get(url);
    }
}