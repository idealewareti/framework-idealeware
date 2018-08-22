import { HttpClientHelper } from "../helpers/http.helper";
import { Injectable } from "@angular/core";
import { CartShowCase } from "../models/cart-showcase/cart-showcase";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CartShowcaseService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    getCartShowCase(): Observable<CartShowCase> {
        let url = `${environment.API_CARTSHOWCASE}/cartshowcase`;
        return this.client.get(url);
    }
}