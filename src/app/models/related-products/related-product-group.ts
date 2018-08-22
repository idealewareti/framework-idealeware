import { EnVariationType } from "../../enums/variationtype.enum";
import { ProductReference } from "./product-reference";

export class RelatedProductGroup {
    id: string;
    name: string;
    status: boolean;
    variation: string;
    type: EnVariationType;
    products: ProductReference[];
}