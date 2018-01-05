export class CustomPaintOption {
    id: string;
    code: string;
    name: string;
    picture: string;
    status: boolean;

    constructor(object = null) {
        if (object)
            return this.CreateFromResponse(object);
    }

    public CreateFromResponse(object): CustomPaintOption {
        let model = new CustomPaintOption();

        for (var k in object) {
            model[k] = object[k];
        }

        return model;
    }
}