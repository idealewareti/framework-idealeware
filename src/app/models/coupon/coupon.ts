import { CouponCustomer } from "./coupon-customer";

export class Coupon {
    id: string;
    name: string;
    code: string;
    startDate: Date;
    endDate: Date;
    status: boolean;
    quantityUsed: number;
    maxUtilization: number;
    expired: boolean;
    customers: CouponCustomer[] = [];

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): Coupon {
        let model = new Coupon();

        for (var k in response) {
            if (k == 'customers' && response[k] != null) {
                model.customers = response.customers.map(c => c = new CouponCustomer(c));
            }
            else if (k == 'startDate' && response[k] == '1901-01-01T00:00:00+00:00')
                model[k] = null;
            else if (k == 'endDate' && response[k] == '1901-01-01T00:00:00+00:00')
                model[k] = null;
            else {
                model[k] = response[k];
            }
        }

        return model;
    }

}