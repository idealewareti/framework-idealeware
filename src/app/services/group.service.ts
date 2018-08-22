import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Group } from "../models/group/group";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GroupService{
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    getAll(): Observable<Group[]>{
        let url = `${environment.API_GROUP}/groups`;
        return this.client.get(url);
    }

    getById(id): Observable<Group>{
        let url = `${environment.API_GROUP}/groups/${id}`;
        return this.client.get(url);
    }
}