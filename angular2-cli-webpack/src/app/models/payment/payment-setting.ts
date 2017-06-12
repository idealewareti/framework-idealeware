export class PaymentSetting {

    name: string;
    value: string;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): PaymentSetting {
        let model = new PaymentSetting();

        for (var k in response) {
            model[k] = response[k];
        }

        return model;

    }
}