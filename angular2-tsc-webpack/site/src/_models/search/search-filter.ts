import { Brand } from "../brand/brand";
import { Category } from "../category/category";
import { Variation } from "../product/variation";
import { VariationOption } from "../product/product-variation-option";

export class Filter {
    
    query: string;
    brands: Brand[] = [];
    categories: Category[] = []
    variations: Variation[] = [];
    options: VariationOption[] = [];

    constructor(filter = null){
        if(filter) return this.createFromResponse(filter);
    }

    createFromResponse(response): Filter{
        let model = new Filter();

        for(let k in response){
            if(k == 'brands'){
                model.brands = response['k'].map(obj => obj = new Brand(obj));
            }
            else if(k == 'categories'){
                model.categories = response['k'].map(obj => obj = new Category(obj));
            }
            else if(k == 'variations'){
                model.variations = response['k'].map(obj => obj = new Variation(obj));
            }

            else if(k == 'options'){
                model.options = response['k'].map(obj => obj = new Option(obj));
            }

            else model[k] = response[k];
        }

        return model;
    }
}