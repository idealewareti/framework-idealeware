export class CustomPaintManufacturer {
    manufacturer: string;
    name: string;
    picture: string;

    constructor(object = null) {
        if (object)
            return this.CreateFromResponse(object);
    }

    public CreateFromResponse(object): CustomPaintManufacturer {
        let model = new CustomPaintManufacturer();

        for (var k in object) {
            model[k] = object[k];
        }

        return model;
    }
}