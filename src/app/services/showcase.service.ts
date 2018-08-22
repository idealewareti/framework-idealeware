import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { ShowCase } from "../models/showcase/showcase";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class ShowCaseService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    public getBannersFromStore() : Observable<ShowCase>{
        let url = `${environment.API_SHOWCASE}/showcases/active`;
        return this.client.get(url);
    }
}