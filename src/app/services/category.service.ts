import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Category } from "../models/category/category";
import { environment } from "../../environments/environment";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";


@Injectable()
export class CategoryService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getTree(): Observable<Category[]> {
        let url = `${environment.API_CATEGORY}/categories/tree`;
        return this.client.get(url)
            .map(res => res.json())
    }

    getCategory(id: string): Observable<Category> {
        let url = `${environment.API_CATEGORY}/categories/${id}`;
        return this.client.get(url)
            .map(res => res.json())
    }

    getChildren(id: string): Promise<Category[]> {
        return new Promise((resolve, reject) => {
            this.getTree()
                .subscribe(categories => {
                    let category = categories.filter(c => c.id == id)[0];
                    if (category && category.children)
                        resolve(category.children);
                    else resolve([]);
                }, error => reject(error));
        });
    }
}