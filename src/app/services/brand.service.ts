import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Brand } from "../models/brand/brand";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class BrandService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    getAll(): Observable<Brand[]> {
        let url = `${environment.API_BRAND}/brands`;
        return this.client.get(url);
    }

    getBrand(id: string): Observable<Brand> {
        let url = `${environment.API_BRAND}/brands/${id}`
        return this.client.get(url);
    }
}