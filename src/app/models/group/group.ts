import {Product} from '../product/product';

declare var S: any;

export class Group{
    id: string;
    code: string;
    name: string;
    position: number;
    picture: string;
    metaTagTitle: string;
    metaTagDescription: string;
    niceName: string;
    products: Product[];

    constructor(object = null){
        if(object) return this.CreateFromResponse(object);
    }

    CreateFromResponse(object){
        let model = new Group();

        for(var k in object){
            if(k == 'products'){
                model.products = object.products.map(p => p = new Product(p));
            }
            else{
                model[k] = object[k];
            }
        }

        model.niceName = model.createNiceName(model);
  
        return model;
    }

    createNiceName(model: Group){
        return S(model.name.toLowerCase().replace(/ /g, '-')
            .replace(/"/g, '')
            .replace(/'/g, '')
            .replace(/\//g, ''))
            .latinise().s;
    }
}