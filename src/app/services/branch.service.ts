import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Branch } from "../models/branch/branch";
import { HttpClientHelper } from '../helpers/http.helper';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BranchService {

    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    public getBranches(zipcode: string): Observable<Branch[]> {
        const url = `${environment.API_BRANCH}/branchs/zipcode/${zipcode}`;
        return this.client.get(url)
            .map(res => res.json());
    }
}