export class MercadoPagoPayerCost {
    installments: number;
    installment_rate: number;
    labels: string[] = [];
    min_allowed_amount: number;
    max_allowed_amount: number;
    recommended_message: string;
    installment_amount: number;
    total_amount: number;

    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }


   createFromResponse(object): MercadoPagoPayerCost{
        let model = new MercadoPagoPayerCost();

        for(let k in object){
            model[k] = object[k];
        }
        return model;
    }
}