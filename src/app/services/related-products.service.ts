import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { RelatedProductGroup } from "../models/related-products/related-product-group";
import { RelatedProductSearch } from "../models/related-products/related-product-search";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class RelatedProductsService {

    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    getRelatedProducts(relatedProductSearch: RelatedProductSearch, page: number = null, pageSize: number = null): Observable<RelatedProductGroup[]> {
        const url = `${environment.API_RELATEDPRODUCTS}/group?name=${relatedProductSearch.name}&nameProduct=${relatedProductSearch.nameProduct}&codeProduct=${relatedProductSearch.codeProduct}&variation=${relatedProductSearch.variation}&page=${page}&pageSize=${pageSize}`;
        return this.client.get(url);
    }

    getRelatedProductGroupById(id: string): Observable<RelatedProductGroup> {
        const url = `${environment.API_RELATEDPRODUCTS}/RelatedProducts/group/${id}`;
        return this.client.get(url);
    }

}