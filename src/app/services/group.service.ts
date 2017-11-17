import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Group } from "../models/group/group";
import { environment } from "../../environments/environment";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";


@Injectable()
export class GroupService{
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getAll(): Observable<Group[]>{
        let url = `${environment.API_GROUP}/groups`;
        return this.client.get(url)
        .map(res => res.json())
    }

    getById(id): Observable<Group>{
        let url = `${environment.API_GROUP}/groups/${id}`;
        return this.client.get(url)
        .map(res => res.json())
    }
}