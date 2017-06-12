export class Vehicle{
    id: number;
    fipe_name: string;
    
    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): Vehicle{
        let model = new Vehicle();
        
        for (var k in response){
            model[k] = response[k];
        }
        return model;
    }
}