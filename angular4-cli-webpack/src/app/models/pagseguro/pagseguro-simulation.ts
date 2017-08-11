import { PagSeguroSimulationBrands } from "app/models/pagseguro/pagseguro.simulation-brands";

export class PagSeguroSimulationResponse {
    error: boolean;
    installments: PagSeguroSimulationBrands;
    
    constructor(object = null){
        if(object) return this.createResponse(object);
    }

    createResponse(object): PagSeguroSimulationResponse{
        let model = new PagSeguroSimulationResponse();

        for(let k in object){
            if(k == 'installments')
                model[k] = new PagSeguroSimulationBrands(object[k]);
            else
                model[k] = object[k];
        }

        return model;
    }
}