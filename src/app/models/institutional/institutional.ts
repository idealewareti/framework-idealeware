export class Institutional {
    id: string;
    title: string;
    content: string;
    position: number;
    metaTagTitle: string;
    metaTagDescription: string;
    status: boolean;
    allowDelete: boolean;

    constructor(object = null) {
        if (object) return this.CreateFromResponse(object);
    }

    CreateFromResponse(object) {
        let model = new Institutional();
        for (var k in object) {
            model[k] = object[k];
        }
        return model;
    }
}