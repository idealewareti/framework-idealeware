import { Injectable } from "@angular/core";
import { BrandService } from "../services/brand.service";
import { Observable } from "rxjs";
import { Brand } from "../models/brand/brand";
import { map, shareReplay } from "rxjs/operators";

const CACHE_SIZE = 1;

@Injectable({
    providedIn: 'root'
})
export class BrandManager {

    private cache$ = new Map<String, Observable<any>>();

    constructor(private service: BrandService) { }

    getAll(): Observable<Brand[]> {
        if (!this.cache$['all']) {
            this.cache$['all'] = this.service.getAll()
                .pipe(map(brands =>
                    brands.filter(brand => brand.picture)
                ), shareReplay(CACHE_SIZE));
        }
        return this.cache$['all'];
    }

    getBrand(id: string): Observable<Brand> {
        if (!this.cache$[id]) {
            this.cache$[id] = this.service.getBrand(id).pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$[id];
    }
}