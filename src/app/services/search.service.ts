import {Injectable} from '@angular/core';
import {ProductPicture} from '../models/product/product-picture';
import {Search} from '../models/search/search';
import { Product } from "../models/product/product";
import { Pagination } from "../models/pagination";
import { SearchResult } from "../models/search/search-result";
import { Category } from "../models/category/category";
import { HttpClientHelper } from '../helpers/http.helper';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class SearchService{
    client: HttpClientHelper;
    
    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    searchFor(search: Search, pageNumber: number = null, pageSize: number = null): Promise<SearchResult>{
        let pagination: Pagination = new Pagination();
        return new Promise((resolve, reject) => {
            let url = `${environment.API_SEARCH}/search/facet?Page=${pageNumber}&PageSize=${pageSize}`;
            search.priceRange.toNumber();
            this.client.post(url, search)
            .map(res => {
                pagination = new Pagination(JSON.parse(res.headers.get('x-pagination')));
                return res.json();
            })
            .subscribe(response => {
                if(response['products']){
                    // response = new SearchResult(response);
                    response.pagination = pagination;
                    resolve(response);
                }
                else{
                    let result: SearchResult = new SearchResult();
                    // result.products = response.map(p => p = new Product(p));
                    result.pagination = pagination;
                    resolve(result);
                }
            }, error => {
                reject(error);
            });

           
        });
    }
}