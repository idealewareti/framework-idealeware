import { PagseguroInstallment } from "app/models/pagseguro/pagseguro-installment";

export class PagSeguroSimulationBrands {
    visa: PagseguroInstallment[] = [];

    constructor(object = null){
        if(object) return this.createResponse(object);
    }

    createResponse(object): PagSeguroSimulationBrands{
        let model = new PagSeguroSimulationBrands();

        for(let k in object){
            model[k] = object[k].map(i => i = new PagseguroInstallment(i));
        }

        return model;
    }
    
}