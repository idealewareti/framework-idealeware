import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ShowcaseGroup } from "../models/showcase/showcase-group";
import { CarouselService } from "../services/carousel.service";
import { shareReplay } from "rxjs/operators";

const CACHE_SIZE = 1;

@Injectable({
    providedIn: 'root'
})
export class CarouselManager {

    private cache$ = new Map<String, Observable<any>>();

    constructor(private service: CarouselService) { }

    getCarousels(): Observable<ShowcaseGroup[]> {
        if (!this.cache$['all']) {
            this.cache$['all'] = this.service.getCarousels().pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$['all'];
    }

    getCarouselProducts(id: string): Observable<ShowcaseGroup> {
        if (!this.cache$[id]) {
            this.cache$[id] = this.service.getCarouselProducts(id).pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$[id];
    }
}