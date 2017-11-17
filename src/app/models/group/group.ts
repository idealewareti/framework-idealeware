import {Product} from '../product/product';

export class Group{
    id: string;
    code: string;
    name: string;
    position: number;
    picture: string;
    metaTagTitle: string;
    metaTagDescription: string;
    products: Product[];

    // CreateFromResponse(object){
    //     let model = new Group();

    //     for(var k in object){
    //         if(k == 'products'){
    //             model.products = object.products.map(p => p = new Product(p));
    //         }
    //         else{
    //             model[k] = object[k];
    //         }
    //     }
    //     return model;
    // }
}