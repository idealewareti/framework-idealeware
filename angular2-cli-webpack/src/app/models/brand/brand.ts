declare var S:any;

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

    constructor(brand = null){
        if(brand) return this.createFromResponse(brand);
    }

    public createFromResponse(response): Brand{
        let model = new Brand();
        
        for (var k in response){
            model[k] = response[k];
        }

        model.niceName = S(model.name.toLowerCase().replace(/ /g, '-')).latinise().s;

        return model;
    }
}