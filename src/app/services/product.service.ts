import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Product } from "../models/product/product";
import { environment } from "../../environments/environment";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ProductService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getProductBySku(skuId: string): Observable<Product> {
        let url = `${environment.GATEWAY_PRODUCT}/products/sku/${skuId}`;
        return this.client.get(url)
            .map(res => res.json())
    }

    getProductById(id: string): Observable<Product> {
        let url = `${environment.GATEWAY_PRODUCT}/products/${id}`;
        return this.client.get(url)
            .map(res => res.json())
    }

    getProducts(references: Object[]): Observable<Product[]> {
        let url = `${environment.GATEWAY_PRODUCT}/products/completebyreference`;
        return this.client.post(url, references)
            .map(res => res.json())
    }

    getProductsFromShowcaseGroup(groupId: string): Observable<Product[]> {
        let url = `${environment.GATEWAY_PRODUCT}/products/showcasegroups/${groupId}`;
        return this.client.get(url)
            .map(res => res.json())
    }
}