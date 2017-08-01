import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpClient} from '../helpers/httpclient'
import {AppSettings} from 'app/app.settings';
import {Category} from '../models/category/category';
import {NgProgressService} from 'ngx-progressbar';

@Injectable()
export class CategoryService{
    constructor(
        private client: HttpClient,
        private loaderService: NgProgressService
     ){

    }

    getTree() : Promise<Category[]>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CATEGORY}/categories/tree`;
            
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
            let url = `${AppSettings.API_CATEGORY}/categories/${id}`;

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