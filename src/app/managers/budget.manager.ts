import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { BudgetService } from "../services/budget.service";
import { CartManager } from "./cart.manager";
import { Budget } from "../models/budget/budget";

@Injectable()
export class BudgetManager{
    constructor(
        private budgetService: BudgetService,
        private cartManager: CartManager
    ){}

    public createBudget(): Observable<Budget> {
        return this.budgetService.createBudget(this.cartManager.getCartId());
    }
}