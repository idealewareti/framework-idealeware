import { Injectable } from '@angular/core';
import { Branch } from "../models/branch/branch";
import { HttpClientHelper } from '../helpers/http.helper';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BranchService {

    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    public getBranches(zipcode: string): Observable<Branch[]> {
        const url = `${environment.API_BRANCH}/branchs/zipcode/${zipcode}`;
        return this.client.get(url);
    }
}