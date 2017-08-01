export class PagseguroInstallment{
    
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
}