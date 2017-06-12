import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpClient} from '../helpers/httpclient'
import {AppSettings} from 'app/app.settings';
import {ProductPicture} from '../models/product/product-picture';
import {Search} from '../models/search/search';
import { NgProgressService } from "ngx-progressbar";
import { Product } from "../models/product/product";
import { Pagination } from "../models/pagination";
import { SearchResult } from "../models/search/search-result";

@Injectable()
export class SearchService{

    constructor(
        private client: HttpClient,
        private loaderService: NgProgressService
    ){ }

    searchFor(search: Search, pageNumber: number = null, pageSize: number = null): Promise<SearchResult>{
        let result = new SearchResult();
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_SEARCH}/search?Page=${pageNumber}&PageSize=${pageSize}`;
            this.client.post(url, search)
            .map(res => {
                let pagination = new Pagination(JSON.parse(res.headers.get('x-pagination')));
                result.pagination = pagination;
                return res.json();
            })
            .subscribe(response => {
                let products = response.map(p => p = new Product(p));
                result.products = products;
                resolve(result);
            }, error => reject(error));

           
        });
    }
}