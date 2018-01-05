export class CustomPaintVariationReference {

    name: string;
    optionId: string;
    optionCode: string;
    optionName: string;
    optionPicture: string;

    constructor(object = null) {
        if (object)
            return this.CreateFromResponse(object);
    }

    public CreateFromResponse(object): CustomPaintVariationReference {
        let model = new CustomPaintVariationReference();

        for (var k in object) {
            model[k] = object[k];
        }

        return model;
    }

}