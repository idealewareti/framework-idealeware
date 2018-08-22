import { Injectable } from "@angular/core";
import { ShowCaseService } from "../services/showcase.service";
import { ShowCase } from "../models/showcase/showcase";
import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";

const CACHE_SIZE = 1;

@Injectable({
    providedIn: 'root'
})
export class ShowCaseManager {

    private cache$: Observable<ShowCase>;

    constructor(private service: ShowCaseService) { }

    public getBannersFromStore(): Observable<ShowCase> {
        if (!this.cache$) {
            this.cache$ = this.service.getBannersFromStore().pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$;
    }
}