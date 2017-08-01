import { VariationOption } from "./product-variation-option";
import { EnVariationType } from "app/enums/variationtype.enum";

export class Variation {

    id: string;
    name: string;
    type : EnVariationType;
    option: VariationOption;
    quantity: number = 0;

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

