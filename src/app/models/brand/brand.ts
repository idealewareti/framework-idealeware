import { AppSettings } from "app/app.settings";

declare var S: any;

export class Brand{
    id: string;
    code: string;
    name: string;
    position: number;
    picture: string;
    metaTagTitle: string;
    metaTagDescription: string;
    status: true;
    niceName: string;
    quantity: number = 0;

    constructor(brand = null){
        if(brand) return this.createFromResponse(brand);
    }

    public createFromResponse(response): Brand{
        let model = new Brand();
        
        for (var k in response){
            model[k] = response[k];
        }

        model.niceName = AppSettings.getNiceName(model.name);

        return model;
    }

    
}