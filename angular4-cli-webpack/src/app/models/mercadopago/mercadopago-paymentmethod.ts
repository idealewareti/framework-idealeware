import { MercadoPagoSettings } from "./mercadopago-settings";
import { MercadoPagoFinancialInstitution } from "./mercadopago-financial-institution";

export class MercadoPagoPaymentMethod {
   id: string;
   name: string;
   payment_type_id: string;
   status:string;
   secure_thumbnail: string;
   thumbnail: string;
   settings: MercadoPagoSettings;
   additional_info_needed: string[] = [];
   min_allowed_amount :number;
   max_allowed_amount: number;
   accreditation_time: number;
   financial_institutions: MercadoPagoFinancialInstitution;

   constructor(object = null){
        if(object) return this.createResponse(object);
    }

   createResponse(object): MercadoPagoPaymentMethod{
        let model = new MercadoPagoPaymentMethod();

        for(let k in object){
            model[k] = object[k];
        }
        return model;
    }
}