import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { HttpClient } from "@angular/common/http";
import { Category } from "../models/category/category";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    getTree(): Observable<Category[]> {
        let url = `${environment.API_CATEGORY}/categories/tree`;
        return this.client.get(url);
    }

    getCategory(id: string): Observable<Category> {
        let url = `${environment.API_CATEGORY}/categories/${id}`;
        return this.client.get(url);
    }
}