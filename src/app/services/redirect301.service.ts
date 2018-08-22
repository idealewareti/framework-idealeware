import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Redirect301Route } from "../models/redirect301/redirect301-route";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { RedirectFrom } from "../models/redirect301/redirectFrom";
import { RedirectTo } from "../models/redirect301/redirectTo";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class Redirect301Service {

    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    getAll(): Observable<Redirect301Route[]> {
        const url: string = `${environment.API_REDIRECT301}/redirect301`;
        return this.client.get(url);
    }

    getRedirectTo(redirectFrom: RedirectFrom): Observable<RedirectTo> {
        const url: string = `${environment.API_REDIRECT301}/redirect301/filter`;
        return this.client.post(url, redirectFrom)
            .pipe(map(res => res.body));
    }
}