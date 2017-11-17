import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { ProductRating } from "../models/product-rating/product-rating";
import { environment } from "../../environments/environment";
import { ProductRatingCreate } from "../models/product-rating/product-rating-create";
import { Token } from "../models/customer/token";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ProductRatingService {
    client: HttpClientHelper;
    
    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }
    
    getProductRating(id:string) : Observable<ProductRating>{
        let url = `${environment.API_PRODUCTRATING}/productrating/Approved/${id}`;
        return this.client.get(url)
        .map(res => res.json())
    }

    createProductRating(productRating: ProductRatingCreate, token: Token): Observable<ProductRatingCreate>{
        let url = `${environment.API_PRODUCTRATING}/productrating`;
        return this.client.post(url, productRating, token)
        .map(res => res.json())
    }
}