import { Injectable } from "@angular/core";
import { Search } from "../models/search/search";
import { Observable } from "rxjs";
import { SearchResult } from "../models/search/search-result";
import { SearchService } from "../services/search.service";

@Injectable({
    providedIn: 'root'
})
export class SearchManager {

    constructor(private service: SearchService) { }

    searchFor(search: Search, pageNumber: number = null, pageSize: number = null): Observable<SearchResult> {
        return this.service.searchFor(search, pageNumber, pageSize);;
    }
}