export class CouponCustomer {
    id: string;
    firstname_Companyname: string;
    lastname_Tradingname: string;
    email: string;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): CouponCustomer {
        let model = new CouponCustomer();

        for (var k in response) {
            model[k] = response[k];
        }

        return model;
    }
}