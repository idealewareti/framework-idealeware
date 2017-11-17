import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Institutional } from "../models/institutional/institutional";
import { environment } from "../../environments/environment";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class InstitutionalService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getAll(): Observable<Institutional[]> {
        let url = `${environment.API_INSTITUTIONAL}/institutionals`;
        return this.client.get(url)
            .map(res => res.json())
    }

    getById(id: string): Observable<Institutional> {
        let url = `${environment.API_INSTITUTIONAL}/institutionals/${id}`;
        return this.client.get(url)
            .map(res => res.json())
    }

    getDefault(): Observable<Institutional> {
        let url = `${environment.API_INSTITUTIONAL}/institutionals/Default`;
        return this.client.get(url)
            .map(res => res.json())
    }
}