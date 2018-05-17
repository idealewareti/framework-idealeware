import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { ShowCase } from "../models/showcase/showcase";
import { environment } from "../../environments/environment";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Product } from "../models/product/product";

@Injectable()
export class ShowCaseService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getShowCase(): Observable<ShowCase> {
        let url = `${environment.API_SHOWCASE}/showcases/banners`;
        return this.client.get(url)
            .map(res => res.json())
    }

    getGroupProducts(groupId: string): Observable<Product[]> {
        let url = `${environment.API_SHOWCASE}/showcases/groups/${groupId}/products`;
        return this.client.get(url)
            .map(res => res.json())
    }
}