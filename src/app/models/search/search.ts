import { EnumSort } from "../../enums/sort.enum";
import { PriceRange } from "./price-range";

export class Search {
    name: string;
    categories: string[] = [];
    brands: string[] = [];
    variations: string[] = [];
    options: string[] = [];
    groups: string[] = [];
    sort: EnumSort;
    priceRange: PriceRange = new PriceRange();
}