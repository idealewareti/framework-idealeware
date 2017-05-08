import { PaymentMethod } from "./payment-method";

export class Payment {
    id: string;
    name: string;

    /**
     * 1: Online, 2 Offline
     * 
     * @type {number}
     * @memberof Payment
     */
    type: number;
    url: string;
    paymentReferenceCode: string;
    paymentDate: Date;
    paymentMethods: PaymentMethod[] = [];
    
    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): Payment{
        let model = new Payment();
        
        for (var k in response){
            if(k == 'paymentMethods'){
                model.paymentMethods = response.paymentMethods.map(o => o = new PaymentMethod(o));
            }
            else
            {
                model[k] = response[k];
            }
        }

        return model;
            
    }
    
}