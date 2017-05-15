import {Product} from '../product/product'
import {Group} from '../group/group';
import {ShowCaseBanner} from './showcase-banner';

export class ShowCase {
    id: string;
    name: string;
    status: boolean;
    backgroundImage: Object = {};
    pictures: ShowCaseBanner[] = [];
    products: Product[];
    groups: Group[] = [];
    metaTagTitle: string;
    metaTagDescription: string;

    constructor(object = null) {
        if(object) return this.CreateFromResponse(object);
    }

    CreateFromResponse(object): ShowCase{
        let model = new ShowCase();

        for(var k in object){
            if(k == 'products'){
                model.products = object.products.map(product => product = new Product(product));
            }
            if(k == 'groups'){
                model.groups = object.groups.map(group => group = new Group(group));
            }
            else if(k == 'pictures'){
                model.pictures = object.pictures.map(picture => picture = new ShowCaseBanner(picture));
            }
            else{
                model[k] = object[k];
            }
        }

        return model;
    }
}