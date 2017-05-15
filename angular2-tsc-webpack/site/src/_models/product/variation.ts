import { VariationOption } from "./product-variation-option";

export class Variation {

    id: string;
    name: string;
    option: VariationOption;

    constructor(variation = null){
        if(variation) return this.createFromResponse(variation);
    }

    public createFromResponse(response) : Variation{
        let model = new Variation();

        for(var k in response){
            if(k == 'option'){
                model.option = new VariationOption(response.option);
            }
            else{
                model[k] = response[k];
            }
        }

        return model;
    }
}

