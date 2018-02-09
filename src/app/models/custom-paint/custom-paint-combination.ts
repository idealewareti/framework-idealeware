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
	
	constructor(object = null){
        if(object)
            return this.CreateFromResponse(object);
    }

    CreateFromResponse(object) : CustomPaintCombination{
        let model = new CustomPaintCombination();

        for (var k in object){
            if(k === 'color'){
                model[k] = new CustomPaintColor(object[k]);
            }
            else if(k === 'variation'){
                model[k] = new CustomPaintVariationReference(object[k]);
            }
            else
                model[k] = object[k];
        }

        return model;
    }
}