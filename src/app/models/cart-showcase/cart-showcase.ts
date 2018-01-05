import { ModelReference } from '../model-reference';

export class CartShowCase {
    id: string;
    name: string;
    status: boolean;
    products: ModelReference[] = []

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): CartShowCase {
        let model = new CartShowCase();
        for (var k in response) {
            if (k == 'products') {
                model.products = response[k].map(c => c = new ModelReference(c));
            }
            else {
                model[k] = response[k];
            }
        }
        return model;
    }
}
