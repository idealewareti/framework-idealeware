import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Institutional } from "../models/institutional/institutional";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class InstitutionalService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    getAll(): Observable<Institutional[]> {
        let url = `${environment.API_INSTITUTIONAL}/institutionals`;
        return this.client.get(url);
    }

    getById(id: string): Observable<Institutional> {
        let url = `${environment.API_INSTITUTIONAL}/institutionals/${id}`;
        return this.client.get(url);
    }

    getDefault(): Observable<Institutional> {
        let url = `${environment.API_INSTITUTIONAL}/institutionals/Default`;
        return this.client.get(url);
    }
}