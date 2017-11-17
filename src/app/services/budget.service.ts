import { HttpClientHelper } from "../helpers/http.helper";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Budget } from "../models/budget/budget";
import { environment } from "../../environments/environment";
import { Token } from "../models/customer/token";


@Injectable()
export class BudgetService {

    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    public createBudget(cartId: string, token: Token): Observable<Budget> {
        let url = `${environment.API_BUDGET}/budgets/${cartId}`;
        return this.client.post(url, null, token)
            .map(res => res.json());
    }
}