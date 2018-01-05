import { IntelipostContent } from "./intelipost-content";

export class Intelipost {
    status: string;
    messages: Object[];
    time: string;
    timezone: string;
    locale: string;
    content: IntelipostContent;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): Intelipost {
        let model = new Intelipost();

        for (var k in response) {
            if (k == 'content') {
                model.content = new IntelipostContent(response.content);
            }
            else {
                model[k] = response[k];
            }
        }

        return model;
    }
}