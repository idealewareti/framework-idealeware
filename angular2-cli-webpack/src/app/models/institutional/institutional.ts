declare var S: any;

export class Institutional{
    id: string;
    title: string;
    content: string;
    position: number;
    metaTagTitle: string;
    metaTagDescription: string;
    status: boolean;
    niceName: string;

    constructor(object = null){
        if(object) return this.CreateFromResponse(object);
    }

    CreateFromResponse(object){
        let model = new Institutional();

        for(var k in object){
            model[k] = object[k];
        }

        model.niceName = model.createNiceName(model);
  
        return model;
    }

    createNiceName(model: Institutional){
        return S(model.title.toLowerCase().replace(/ /g, '-')).latinise().s
    }
}