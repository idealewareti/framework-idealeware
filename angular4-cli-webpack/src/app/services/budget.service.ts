import {Injectable} from '@angular/core';
import {HttpClient} from '../helpers/httpclient'
import {Title} from '@angular/platform-browser';
import {AppSettings} from 'app/app.settings';
import {NgProgressService} from 'ngx-progressbar';
import { Token } from "../models/customer/token";
import { AppTexts } from "app/app.texts";
import { Budget } from "../models/budget/budget";

@Injectable()
export class BudgetService{

    constructor(
        private client: HttpClient,
        private loader: NgProgressService

    ){ }

    private getToken(): Token{
        let token = new Token();
        token.accessToken = localStorage.getItem('auth'); 
        token.tokenType = 'Bearer';
        return token;
    }

    public createBudget(cartId: string): Promise<Budget>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_BUDGET}/budgets/${cartId}`;
            this.client.post(url, null, this.getToken())
            .map(res => res.json())
            .subscribe(response => {
                let budget = new Budget(response);
                resolve(budget);
            }, error => reject(error));
        });
    }
}