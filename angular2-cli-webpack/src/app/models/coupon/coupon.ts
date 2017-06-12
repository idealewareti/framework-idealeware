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
    
    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): Coupon{
        let model = new Coupon();
        
        for (var k in response){
            if(k == 'customers'){
                model.customers = response.customers.map(c => c = new CouponCustomer(c));
            }
            else{
                model[k] = response[k];
            }
        }

        return model;
    }
    
}