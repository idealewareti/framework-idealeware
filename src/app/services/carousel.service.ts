import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { ShowcaseGroup } from "../models/showcase/showcase-group";
import { environment } from "../../environments/environment";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Product } from "../models/product/product";

@Injectable()
export class CarouselService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getCarousels() : Observable<ShowcaseGroup[]>{
        let url = `${environment.API_CAROUSEL}/carousels`;
        return this.client.get(url)
            .map(res => res.json().carousels)
    }

    getCarouselProducts(carouselId: string): Observable<ShowcaseGroup> {
        let url = `${environment.API_CAROUSEL}/carousels/${carouselId}`;
        return this.client.get(url)
            .map(res => res.json())
    }
}