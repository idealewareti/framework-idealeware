import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Brand } from "../models/brand/brand";
import { environment } from "../../environments/environment";
import { Http } from "@angular/http";

@Injectable()
export class BrandService{
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getAll(): Promise<Brand[]>{
        return new Promise((resolve, reject) => {
            let url = `${environment.API_BRAND}/brands`;
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
            let url = `${environment.API_BRAND}/brands/${id}`
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                resolve(new Brand(response));
            }, error => reject(error));
        })
    }
}