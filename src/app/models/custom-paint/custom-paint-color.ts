export class CustomPaintColor {
    code: string;
    name: string;
    rgb: string;
    manufacturer: string;
    position: number;
    familyName: string;
    familyCode: number;
    familyPosition: number;

    constructor(object = null) {
        if (object)
            return this.CreateFromResponse(object);
    }

    public CreateFromResponse(object): CustomPaintColor {
        let model = new CustomPaintColor();

        for (var k in object) {
            model[k] = object[k];
        }

        return model;
    }
}
