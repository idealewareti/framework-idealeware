import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { ProductAwaited } from "../models/product-awaited/product-awaited";
import { environment } from "../../environments/environment.prod";
import { Http } from "@angular/http";

@Injectable()
export class ProductAwaitedService{
    client: HttpClientHelper;
    
    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    createProductAwaited(productAwaited: ProductAwaited): Promise<ProductAwaited>{
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PRODUCTAWAITED}/productsAwaited`;
            this.client.post(url, productAwaited)
            .map(res => res.json())
            .subscribe(response => {
                let productsAwaited = new ProductAwaited(response);
                resolve(productsAwaited);
            }, error => reject(error));
        });
    }

}