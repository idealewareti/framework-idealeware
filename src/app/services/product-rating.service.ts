import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { ProductRating } from "../models/product-rating/product-rating";
import { environment } from "../../environments/environment";
import { ProductRatingCreate } from "../models/product-rating/product-rating-create";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProductRatingService {
    client: HttpClientHelper;
    
    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }
    
    getProductRating(id:string) : Observable<ProductRating>{
        let url = `${environment.API_PRODUCTRATING}/productrating/Approved/${id}`;
        return this.client.get(url);
    }

    createProductRating(productRating: ProductRatingCreate): Observable<ProductRatingCreate>{
        let url = `${environment.API_PRODUCTRATING}/productrating`;
        return this.client.post(url, productRating);
    }
}