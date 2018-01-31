import { CustomPaintColor } from "./custom-paint-color";
import { CustomPaintVariationReference } from "./custom-paint-combination-variation";
import { Paint } from "./custom-paint";

export class CustomPaintCombination {
    id: string;
    name: string;
    picture: string;
    code: string;
    color: CustomPaintColor;
    variation: CustomPaintVariationReference;
    price: number;
    status: boolean;
}