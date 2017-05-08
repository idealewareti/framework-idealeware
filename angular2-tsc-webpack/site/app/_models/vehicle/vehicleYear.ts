export class VehicleYear{
    name: string;
    
    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): VehicleYear{
        let model = new VehicleYear();
        
        for (var k in response){
            model[k] = response[k];
        }
        return model;
    }
}