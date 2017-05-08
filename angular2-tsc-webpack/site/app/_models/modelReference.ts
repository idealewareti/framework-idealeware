export class ModelReference{
    id: string;
    name: string;
    
    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): ModelReference{
        let model = new ModelReference();
        
        for (var k in response){
            model[k] = response[k];
        }

        return model;
            
    }
    
}