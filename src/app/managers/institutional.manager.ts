import { Injectable } from "@angular/core";
import { InstitutionalService } from "../services/institutional.service";
import { Observable } from "rxjs";
import { Institutional } from "../models/institutional/institutional";
import { shareReplay } from "rxjs/operators";

const CACHE_SIZE = 1;

@Injectable({
    providedIn: 'root'
})
export class InstitutionalManager {

    private cache$ = new Map<String, Observable<any>>();

    constructor(private service: InstitutionalService) { }

    getAll(): Observable<Institutional[]> {
        if (!this.cache$['all']) {
            this.cache$['all'] = this.service.getAll().pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$['all'];
    }

    getById(id: string): Observable<Institutional> {
        if (!this.cache$[id]) {
            this.cache$[id] = this.service.getById(id).pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$[id];
    }

    getDefault(): Observable<Institutional> {
        if (!this.cache$['default']) {
            this.cache$['default'] = this.service.getDefault().pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$['default'];
    }
}