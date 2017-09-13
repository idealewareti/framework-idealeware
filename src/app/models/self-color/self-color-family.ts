import { SelfColor } from "./self-color";

export class SelfColorFamily {
    id: string;
    name: string;
    colors: SelfColor[] = [];

    constructor(family = null){
        if(family) return this.CreateFromResponse(family);
    }

     CreateFromResponse(object): SelfColorFamily{
        let model = new SelfColorFamily();

        for(var k in object){
            if(k == 'colors'){
                model.colors = object[k].map(color => color = new SelfColor(color['code'], color['name'], color['hex']));
            }
            else{
                model[k] = object[k];
            }
        }
        return model;
     }
}
