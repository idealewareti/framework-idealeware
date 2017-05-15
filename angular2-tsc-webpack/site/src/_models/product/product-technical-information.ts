export class TechnicalInformation{
    name: string;
    description: string;

    constructor(info = null){
        if(info) return this.createFromResponse(info);
    }

    public createFromResponse(response): TechnicalInformation{
        let model = new TechnicalInformation();
        
        for (var k in response){
            model[k] = response[k];
        }

        return model;
    }
}