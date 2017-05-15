export class VehicleBrand{
    id: number;
    fipe_name: string;
    
    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): VehicleBrand{
        let model = new VehicleBrand();
        
        for (var k in response){
            model[k] = response[k];
        }

        return model;
            
    }
    
}