import { EnVariationType } from "../../enums/variationtype.enum";
import { ProductReference } from "./product-reference";

export class RelatedProductGroup {
    id: string;
    name: string;
    status: boolean;
    variation: string;
    type: EnVariationType;
    products: ProductReference[] = [];

    constructor(filter = null){
        if(filter) return this.createFromResponse(filter);
        else{
            this.id = null;
            this.name = null;
            this.status = false;
            this.variation = null;
            this.products = [];
            this.type = 0;
        }
    }

    createFromResponse(response): RelatedProductGroup{
        let model = new RelatedProductGroup();

        for(let k in response){
            if(k == 'products' && response[k])
                model.products = response[k].map(product => product = new ProductReference(product));
            else
                model[k] = response[k];
        }

        return model;
    }
}