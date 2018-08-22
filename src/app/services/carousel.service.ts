import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { ShowcaseGroup } from "../models/showcase/showcase-group";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class CarouselService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    getCarousels(): Observable<ShowcaseGroup[]> {
        let url = `${environment.API_CAROUSEL}/carousels`;
        return this.client.get(url)
            .pipe(map(res => res.carousels));
    }

    getCarouselProducts(carouselId: string): Observable<ShowcaseGroup> {
        let url = `${environment.API_CAROUSEL}/carousels/${carouselId}`;
        return this.client.get(url);
    }
}