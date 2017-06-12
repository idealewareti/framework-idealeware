import { Product } from "../product/product";
import { Pagination } from "../pagination";

export class SearchResult {
    products: Product[];
    pagination: Pagination;

    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): SearchResult{
        let model = new SearchResult();
        
        for (var k in response){
            model[k] = response[k];
        }

        return model;
            
    }
}