export class DneAddress {
    neighborhoods: string;
    city: string;
    ibge: string;
    street: string;
    zipCode: string;
    alterDate: Date;
    state: string;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): DneAddress {
        let model = new DneAddress();

        for (var k in response) {
            model[k] = response[k];
        }

        return model;

    }
}