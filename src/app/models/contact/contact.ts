export class Contact {
    email: string;
    message: string;
    name: string;
    title: string;

    constructor(contact = null) {
        if (contact)
            return this.createFromResponse(contact);
    }

    public createFromResponse(response): Contact {
        let model = new Contact();

        for (var k in response) {
            model[k] = response[k];
        }

        return model;
    }
}