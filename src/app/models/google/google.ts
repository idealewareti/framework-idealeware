export class Google {
    id: string;
    uaCode: string;
    createDate: Date;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): Google {
        let model = new Google();

        for (var k in response) {
            model[k] = response[k];
        }

        return model;

    }

}