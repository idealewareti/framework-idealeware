import { ModelReference } from '../model-reference';

export class Banner {
    id: string;
    name: string;
    url: string;
    picture: string;
    place: number;
    startDateTime: Date;
    endDateTime: Date;
    categories: ModelReference[] = [];
    brands: ModelReference[] = [];
    groups: ModelReference[] = [];
    status: boolean;


    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): Banner {
        let model = new Banner();

        for (var k in response) {
            if (k == 'categories') {
                model.categories = response[k].map(c => c = new ModelReference(c));
            }
            else if (k == 'brands') {
                model.brands = response[k].map(c => c = new ModelReference(c));
            }
            else if (k == 'groups') {
                model.groups = response[k].map(c => c = new ModelReference(c));
            }
            else {
                model[k] = response[k];
            }
        }

        return model;
    }
}

