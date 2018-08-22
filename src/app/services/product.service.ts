import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Product } from "../models/product/product";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    getProductBySku(skuId: string): Observable<Product> {
        let url = `${environment.API_PRODUCT}/products/sku/${skuId}`;
        return this.client.get(url);
    }

    getProductById(id: string): Observable<Product> {
        let url = `${environment.API_PRODUCT}/products/${id}`;
        return this.client.get(url);
    }

    getProducts(references: Object[]): Observable<Product[]> {
        let url = `${environment.API_PRODUCT}/products/completebyreference`;
        return this.client.post(url, references);
    }

    getProductsFromShowcaseGroup(groupId: string): Observable<Product[]> {
        let url = `${environment.API_PRODUCT}/products/showcasegroups/${groupId}`;
        return this.client.get(url);
    }
}