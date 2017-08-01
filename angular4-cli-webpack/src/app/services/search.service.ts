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
import { Category } from "app/models/category/category";

@Injectable()
export class SearchService{

    constructor(
        private client: HttpClient,
        private loaderService: NgProgressService
    ){ }

    searchFor(search: Search, pageNumber: number = null, pageSize: number = null): Promise<SearchResult>{
        let pagination: Pagination = new Pagination();
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_SEARCH}/search/facet?Page=${pageNumber}&PageSize=${pageSize}`;
            search.priceRange.toNumber();
            this.client.post(url, search)
            .map(res => {
                pagination = new Pagination(JSON.parse(res.headers.get('x-pagination')));
                return res.json();
            })
            .subscribe(response => {
                if(response['products']){
                    response = new SearchResult(response);
                    response.pagination = pagination;
                    resolve(response);
                }
                else{
                    let result: SearchResult = new SearchResult();
                    result.products = response.map(p => p = new Product(p));
                    result.pagination = pagination;
                    resolve(result);
                }
            }, error => {
                reject(error);
            });

           
        });
    }
}