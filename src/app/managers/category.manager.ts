import { Injectable } from "@angular/core";
import { CategoryService } from "../services/category.service";
import { Observable } from "rxjs";
import { Category } from "../models/category/category";
import { shareReplay } from "rxjs/operators";

const CACHE_SIZE = 1;

@Injectable({
    providedIn: 'root'
})
export class CategoryManager {

    private cache$ = new Map<String, Observable<any>>();

    constructor(private service: CategoryService) { }

    getTree(): Observable<Category[]> {
        if (!this.cache$['all']) {
            this.cache$['all'] = this.service.getTree()
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.cache$['all'];
    }

    getCategory(id: string): Observable<Category> {
        if (!this.cache$[id]) {
            this.cache$[id] = this.service.getCategory(id)
                .pipe(shareReplay(CACHE_SIZE));
        }
        return this.cache$[id];
    }
}