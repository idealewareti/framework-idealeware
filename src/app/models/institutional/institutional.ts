import { AppSettings } from "app/app.settings";

export class Institutional {
    id: string;
    title: string;
    content: string;
    position: number;
    metaTagTitle: string;
    metaTagDescription: string;
    status: boolean;
    niceName: string;
    allowDelete: boolean;

    constructor(object = null){
        if(object) return this.CreateFromResponse(object);
    }

    CreateFromResponse(object){
        let model = new Institutional();

        for(var k in object){
            model[k] = object[k];
        }

        model.niceName = AppSettings.getNiceName(model.title);
  
        return model;
    }
}