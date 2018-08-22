import { Product } from "../product/product";
import { Pagination } from "../pagination";
import { Brand } from "../brand/brand";
import { Category } from "../category/category";
import { VariationOption } from "../product/product-variation-option";
import { PriceRange } from "./price-range";
import { Variation } from "../product/variation";

export class SearchResult {
    facetBrands: Brand[];
    facetCategories: Category[];
    facetOptions: VariationOption[];
    facetPrice: PriceRange;
    facetVariations: Variation[];
    products: Product[];
    metaTagTitle: string;
    metaTagDescription: string;
    pagination: Pagination;
}