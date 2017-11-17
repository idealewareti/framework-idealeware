import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Http } from "@angular/http";
import { Redirect301Route } from "../models/redirect301/redirect301-route";
import { Observable } from "rxjs/Observable";
import { environment } from "../../environments/environment";

@Injectable()
export class Redirect301Service {

    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getAll(): Observable<Redirect301Route[]> {
        const url: string = `${environment.API_REDIRECT301}/redirect301`;
        return this.client.get(url)
            .map(res => res.json());
    }
}