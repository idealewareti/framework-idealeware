import { Coupon } from "../coupon/coupon";

export class PopUp {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: true;
    expired: true;
    picture: string;
    registrationRequired: boolean;
    coupon: Coupon;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): PopUp {
        let model = new PopUp();

        for (var k in response) {
            if(k == 'coupon')
            {
                model.coupon = new Coupon(response.coupon);
            }
            else {
                model[k] = response[k];
            }
        }
        return model;
    }
}