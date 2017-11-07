import { Product } from "../product/product";
import { Pagination } from "../pagination";
import { Brand } from "../brand/brand";
import { Category } from "../category/category";
import { VariationOption } from "../product/product-variation-option";
import { PriceRange } from "./price-range";
import { Variation } from "../product/variation";

export class SearchResult {
    facetBrands: Brand[] = [];
    facetCategories: Category[] = [];;
    facetOptions: VariationOption[]
    facetPrice: PriceRange;
    facetVariations: Variation[] = [];
    products: Product[];
    pagination: Pagination;

    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): SearchResult{
        let model = new SearchResult();
        
        for (var k in response){
            if(k == 'products' && response[k])
                model.products = response[k].map(x => x = new Product(x));
            else if(k == 'facetBrands' && response[k])
                model.facetBrands = response[k].map(x => x = new Brand(x));
            else if(k == 'facetCategories' && response[k])
                model.facetCategories = response[k].map(x => x = new Category(x));    
            else if(k == 'facetOptions' && response[k])
                model.facetOptions = response[k].map(x => x = new VariationOption(x));
            else if(k == 'facetVariations' && response[k])
                model.facetVariations = response[k].map(x => x = new Variation(x));
            else if(k == 'pagination' && response[k])
                model.pagination = new Pagination(response[k]);
            else if(k == 'facetPrice' && response[k])
                model.facetPrice = new PriceRange(response[k]['maximumPrice'], response[k]['minimumPrice']);
            else
                model[k] = response[k];
        }

        return model;
            
    }
}