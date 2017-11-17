import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { ProductAwaited } from "../models/product-awaited/product-awaited";
import { environment } from "../../environments/environment";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ProductAwaitedService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    createProductAwaited(productAwaited: ProductAwaited): Observable<ProductAwaited> {
        let url = `${environment.API_PRODUCTAWAITED}/productsAwaited`;
        return this.client.post(url, productAwaited)
            .map(res => res.json());
    }
}