export class BudgetProduct {

    id: string;
    name: string;
    quantity: number;
    price: number;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    createFromResponse(object): BudgetProduct {
        let model = new BudgetProduct();

        for (var k in object) {
            model[k] = object[k];
        }

        return model;
    }
}