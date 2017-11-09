import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { ProductRating } from "../models/product-rating/product-rating";
import { environment } from "../../environments/environment";
import { ProductRatingCreate } from "../models/product-rating/product-rating-create";
import { Token } from "../models/customer/token";
import { Http } from "@angular/http";

@Injectable()
export class ProductRatingService {
    client: HttpClientHelper;
    
    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }
    
    getProductRating(id:string) : Promise<ProductRating>{
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PRODUCTRATING}/productrating/Approved/${id}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response =>{
                let productRating = new ProductRating(response);
                resolve(productRating)
            }, error => {
                reject(error);
            });
        });
    }

    createProductRating(productRating: ProductRatingCreate, token: Token): Promise<ProductRatingCreate>{
      return new Promise((resolve, reject) => {
            let url = `${environment.API_PRODUCTRATING}/productrating`;
            this.client.post(url, productRating, token)
            .map(res => res.json())
            .subscribe(response => {
                let productsRating = new ProductRatingCreate(response);
                resolve(productsRating);
            }, error => reject(error));
        });
    }
}