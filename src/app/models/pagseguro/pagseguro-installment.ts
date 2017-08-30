import { Installment } from "app/models/payment/installment";

export class PagseguroInstallment {
    
    installmentAmount: number;
    interestFree: boolean;
    quantity: number;
    totalAmount: number;

    constructor(object = null){
        if(object) return this.createResponse(object);
    }

    createResponse(object): PagseguroInstallment{
        let model = new PagseguroInstallment();

        for(let k in object){
            model[k] = object[k];
        }

        return model;
    }

    convertToInstallment(): Installment{
        let installment: Installment = new Installment(
            { 
                number: this.quantity, 
                installmentPrice: this.installmentAmount, 
                totalPrice: this.totalAmount,
                description: (this.interestFree) ? 's/ juros' : 'c/ juros'
            });
        return installment;
    }
}