export class BranchLocal {
    zipCodeStart: string;
    zipCodeEnd: string;
    value: number;
    deliveryTime: number;

    constructor(brand = null) {
        if (brand) return this.createFromResponse(brand);
    }

    public createFromResponse(response): BranchLocal {

        let model = new BranchLocal();

        for (var k in response) {
            model[k] = response[k];
        }

        return model;
    }
}