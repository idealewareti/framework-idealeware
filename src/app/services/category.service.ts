import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Category } from "../models/category/category";
import { environment } from "../../environments/environment";
import { Http } from "@angular/http";

@Injectable()
export class CategoryService{
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getTree(): Promise<Category[]>{
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CATEGORY}/categories/tree`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(categories => {
                resolve(categories.map(c => c = new Category(c)));
            }, error => {
                reject(error);
            });
        });
    }

    getCategory(id: string): Promise<Category>{
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CATEGORY}/categories/${id}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                resolve(new Category(response));
            }, error => reject(error));
        });
    }

    getChildren(id: string): Promise<Category[]>{
        return new Promise((resolve, reject) => {
            this.getTree()
            .then(categories => {
                let category = categories.filter(c => c.id == id)[0];
                if(category && category.children)
                    resolve(category.children);
                else resolve([]);
            })
            .catch(error => reject(error));
        });
    }

}