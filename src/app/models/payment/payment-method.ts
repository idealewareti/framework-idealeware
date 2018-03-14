import { Installment } from "./installment";
import { PaymentMethodTypeEnum } from "../../enums/payment-method-type.enum";

export class PaymentMethod {
        id: string;
        code: string;
        type: PaymentMethodTypeEnum;
        name: string;
        icon: string;
        creditCardHolderName: string;
        creditCardInstallmentCount: number;
        creditCardInstallmentPrice: number;
        creditCardInterest: number;
        discount: number;
        bankSlipUrl: string;
        installment: Installment[] = [];
    
    constructor(object = null){
        if(object)
            return this.createFromResponse(object);
        else{
            this.id = null;
            this.code = null;
            this.name = null;
        }
    }

    public createFromResponse(response): PaymentMethod{
        let model = new PaymentMethod();
        
        for (var k in response){
            if(k == 'installment'){
                model.installment = response.installment.map(i => i = new Installment(i));
            }
            else{
                model[k] = response[k];
            }
        }

        return model;
            
    }

    public methodName(){
        let name = ['Cartão de Crédito', 'Boleto', 'Dinheiro', 'Outro'];
        return name[this.type - 1];
    }
    
}