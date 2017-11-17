import { HttpClientHelper } from "../helpers/http.helper";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { CartShowCase } from "../models/cart-showcase/cart-showcase";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs/Observable";

@Injectable()
export class CartShowcaseService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getCartShowCase(): Observable<CartShowCase> {
        let url = `${environment.API_CARTSHOWCASE}/cartshowcase`;
        return this.client.get(url)
            .map(res => res.json())
    }
}