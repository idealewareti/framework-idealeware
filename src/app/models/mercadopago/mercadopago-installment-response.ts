import { MercadoPagoIssuer } from './mercadopago-issuer';
import { MercadoPagoPayerCost } from './mercadopago-payer-cost';

export class MercadoPagoInstallmentResponse {
    payment_method_id: string;
    payment_type_id: string;
    issuer: MercadoPagoIssuer;
    payer_costs: MercadoPagoPayerCost[] = [];


    constructor(object = null){
        if(object) return this.createResponse(object);
    }


   createResponse(object): MercadoPagoInstallmentResponse{
        let model = new MercadoPagoInstallmentResponse();

        for(let k in object){
            if(k == 'issuer')
                model[k] = new MercadoPagoIssuer(object[k]);
            else if(k == 'payer_costs' && object[k])
                model[k] = object[k].map(payer_cost => payer_cost = new MercadoPagoPayerCost(payer_cost));
            else
                model[k] = object[k];
        }
        return model;
    }
}