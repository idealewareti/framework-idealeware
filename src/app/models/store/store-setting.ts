export class StoreSetting{
    id: string;
    title: string;
    description: string;
    status: boolean;
    type: number;

    public constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): StoreSetting{
        let model = new StoreSetting();
        
        for (var k in response){
            model[k] = response[k];
        }

        return model;
    }
}