import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { ProductAwaited } from "../models/product-awaited/product-awaited";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProductAwaitedService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    createProductAwaited(productAwaited: ProductAwaited): Observable<ProductAwaited> {
        let url = `${environment.API_PRODUCTAWAITED}/productsAwaited`;
        return this.client.post(url, productAwaited);
    }
}