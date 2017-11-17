import { PaymentMethod } from "./payment-method";
import { EnumPaymentType } from "../../enums/payment-type.enum";
import { PaymentSetting } from "./payment-setting";

export class Payment {
    id: string;
    default: boolean;
    isSandBox: boolean;
    name: string;
    type: EnumPaymentType;
    url: string;
    paymentReferenceCode: string;
    paymentDate: Date;
    paymentMethods: PaymentMethod[] = [];
    settings: PaymentSetting[] = [];

    constructor(object = null){
        if(object) return this.createFromResponse(object);
        else{
            this.id = null;
            this.name = null;
        }
    }

    public createFromResponse(response): Payment{
        let model = new Payment();
        
        for (var k in response){
            if(k == 'paymentMethods'){
                model.paymentMethods = response.paymentMethods.map(o => o = new PaymentMethod(o));
            }
            else if(k == 'settings' && response[k])
            {
                model.settings = response.settings.map(o => o = new PaymentSetting(o));

            }
            else
            {
                model[k] = response[k];
            }
        }

        return model;
            
    }
    
}