import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Brand } from "../models/brand/brand";
import { environment } from "../../environments/environment";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";


@Injectable()
export class BrandService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getAll(): Observable<Brand[]> {
        let url = `${environment.API_BRAND}/brands`;
        return this.client.get(url)
            .map(res => res.json())
    }

    getBrand(id: string): Observable<Brand> {
        let url = `${environment.API_BRAND}/brands/${id}`
        return this.client.get(url)
            .map(res => res.json())
    }
}