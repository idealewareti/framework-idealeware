import { Branch } from "../branch/branch";
import { DeliveryInformation } from "./delivery-information";
import { EnumShippingType } from "app/enums/shipping-type.enum";

export class Shipping {

    /**
     * [1: PickuUpStore | 2: Delivery]
     * 
     * @type {number}
     * @memberof Shipping
     */
    shippingType: EnumShippingType = 0;
    branch: Branch;
    deliveryInformation: DeliveryInformation;
    
    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): Shipping{
        let model = new Shipping();
        
        for (var k in response){
            if(k == 'deliveryInformation'){
                model.deliveryInformation = new DeliveryInformation(response.DeliveryInformation);
            }
            else if(k == 'branch'){
                model.branch = new Branch(response.branch);
            }
            else
            {
                model[k] = response[k];
            }
        }

        return model;
            
    }
    
}