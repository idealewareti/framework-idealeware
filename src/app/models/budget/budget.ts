import { BudgetSituation } from "./budget-situation";
import { BudgetCustomer } from "./budget-customer";
import { BudgetProduct } from "./budget-product";

export class Budget {
    id: string;
    numberBudget: string;
    situation: BudgetSituation[] = [];
    customer: BudgetCustomer;
    product: BudgetProduct[] = [];
    dateCreate: Date;
    statusCurrent: number;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    createFromResponse(object): Budget {
        let model = new Budget();

        for (var k in object) {
            if (k == 'situation') {
                model.situation = object.situation.map(s => s = new BudgetSituation(s));
            }
            else if (k == 'customer') {
                model.customer = new BudgetCustomer(object.customer)
            }
            else if (k == 'product' && object[k]) {
                model.product = object.product.map(p => p = new BudgetProduct(p));
            }
            else {
                model[k] = object[k];
            }
        }

        return model;
    }

}