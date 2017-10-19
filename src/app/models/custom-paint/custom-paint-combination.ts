import { CustomPaintColor } from "app/models/custom-paint/custom-paint-color";
import { CustomPaintVariationReference } from "app/models/custom-paint/custom-paint-combination-variation";
import { Paint } from "app/models/custom-paint/custom-paint";

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

    public CreateFromResponse(object) : CustomPaintCombination{
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

    public exportAsPaint(): Paint{
        return new Paint({
            id: this.id,
            baseName: this.name,
            colorCode: this.color.code,
            colorName: this.color.name,
            colorRgb: this.color.rgb,
            manufacturer: this.color.manufacturer,
            optionCode: this.code,
            optionId: this.variation.optionId,
            optionName: this.variation.optionName,
            optionPicture: this.variation.optionPicture
        });
    }


    getColor(): string{
        if(/^\S{6}$/.test(this.color.rgb))
            return `#${this.color.rgb}`;
        else
            return `rgb(${this.color.rgb})`;
    }
}