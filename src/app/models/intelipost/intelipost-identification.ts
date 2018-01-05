export class IntelipostIdentification {

    session: string;
    ip: string;
    pageName: string;
    url: string;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): IntelipostIdentification {
        let model = new IntelipostIdentification();

        for (var k in response) {
            model[k] = response[k];
        }

        return model;
    }
}