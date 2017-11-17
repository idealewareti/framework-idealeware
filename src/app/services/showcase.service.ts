import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { ShowCase } from "../models/showcase/showcase";
import { environment } from "../../environments/environment";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ShowCaseService{
    client: HttpClientHelper;
    
    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getShowCase(): Observable<ShowCase>{
        let url = `${environment.API_SHOWCASE}/showcases`;
        let showcase = new ShowCase();
        return this.client.get(url)
        .map(res => res.json())
    }
}