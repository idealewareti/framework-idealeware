import { HttpClientHelper } from "../helpers/http.helper";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Budget } from "../models/budget/budget";
import { environment } from "../../environments/environment";


@Injectable({
    providedIn: 'root'
})
export class BudgetService {

    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    public createBudget(cartId: string): Observable<Budget> {
        let url = `${environment.API_BUDGET}/budgets/${cartId}`;
        return this.client.post(url)
        .pipe(map(res => res.body));
    }
}