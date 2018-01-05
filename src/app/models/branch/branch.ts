import { BranchLocal } from "./branch-local";

export class Branch {
    id: string;
    code: string;
    name: string;
    managerName: string;
    managerEmail: string;
    addressLine1: string;
    addressLine2: string;
    state: string;
    country: string;
    district: string;
    city: string;
    zipCode: string;
    locals: BranchLocal[] = [];
    status: boolean;
    number: string;
    allowPickupStore: boolean;
    replenishmentTime: number

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): Branch {
        let model = new Branch();

        for (var k in response) {
            if (k == 'locals') {
                model.locals = response.locals.map(local => local = new BranchLocal(local));
            }
            else {
                model[k] = response[k];
            }
        }

        return model;
    }

}