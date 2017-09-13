export class PagseguroCardBrand{
    name: string;
    bin: number;
    cvvSize: number;
    expirable: boolean;
    validationAlgorithm: string;

    constructor(object = null){
        if(object) return this.createResponse(object);
    }

    createResponse(object): PagseguroCardBrand{
        let model = new PagseguroCardBrand();

        for(let k in object){
            model[k] = object[k];
        }

        return model;
    }
}