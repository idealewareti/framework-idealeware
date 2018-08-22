import { Injectable } from '@angular/core';
import { Search } from '../models/search/search';
import { SearchResult } from "../models/search/search-result";
import { HttpClientHelper } from '../helpers/http.helper';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    searchFor(search: Search, pageNumber: number = null, pageSize: number = null): Observable<SearchResult> {
        let url = `${environment.API_SEARCH}/search/facet?Page=${pageNumber}&PageSize=${pageSize}`;
        return this.client.post(url, search)
            .pipe(map(res => {
                let result: SearchResult = new SearchResult();
                result = res.body;
                result.pagination = JSON.parse(res.headers.get('x-pagination'));
                return result;
            }));
    }
}