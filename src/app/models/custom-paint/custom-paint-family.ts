export class CustomPaintFamily {
    name: string;
    code: number;
    position: number;

    constructor(object = null) {
        if (object)
            return this.CreateFromResponse(object);
    }

    public CreateFromResponse(object): CustomPaintFamily {
        let model = new CustomPaintFamily();

        for (var k in object) {
            model[k] = object[k];
        }

        return model;
    }
}