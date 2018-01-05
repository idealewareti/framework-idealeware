export class BudgetSituation {
    situationCurrent: number;
    dateSituation: Date;
    observation: string;
    reasonCanceled: string;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    createFromResponse(object): BudgetSituation {
        let model = new BudgetSituation();

        for (var k in object) {
            model[k] = object[k];
        }

        return model;
    }
}