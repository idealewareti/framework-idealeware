import { BudgetSituation } from "./budget-situation";
import { BudgetCustomer } from "./budget-customer";
import { BudgetProduct } from "./budget-product";

export class Budget {
    id: string;
    numberBudget: string;
    situation: BudgetSituation[];
    customer: BudgetCustomer;
    product: BudgetProduct[];
    dateCreate: Date;
    statusCurrent: number;
}