import { Brand } from "../brand/brand";
import { Category } from "../category/category";
import { Variation } from "../product/variation";
import { VariationOption } from "../product/product-variation-option";
import { Group } from "../group/group";

export class Filter {
    query: string;
    brands: Brand[] = [];
    categories: Category[] = [];
    variations: Variation[] = [];
    options: VariationOption[] = [];
    groups: Group[] = [];
}