import { CustomPaintOption } from "./custom-paint-option";

export class CustomPaintVariation {
    manufacturer: string;
    name: string;
    options: CustomPaintOption[] = [];


    constructor(object = null) {
        if (object)
            return this.CreateFromResponse(object);
    }

    public CreateFromResponse(object): CustomPaintVariation {
        let model = new CustomPaintVariation();

        for (var k in object) {
            if (k === 'options') {
                model[k] = object[k].map(option => new CustomPaintOption(option));
            }
            else
                model[k] = object[k];
        }

        return model;
    }
}