import { EnumSort } from "app/enums/sort.enum";
import { PriceRange } from "app/models/search/price-range";

export class Search {
    name: string;
    categories: string[] = [];
    brands: string[] = [];
    variations: string[] = [];
    options: string[] = [];
    groups: string[] = [];
    sort: EnumSort;
    priceRange: PriceRange;

    constructor(search = null){
        if(search) return this.createFromResponse(search);

        else{
            this.priceRange = new PriceRange(0, 0);
        }
    }

    createFromResponse(response): Search{
        let model = new Search();

        for(let k in response){
           model[k] = response[k];
        }

        return model;
    }
}