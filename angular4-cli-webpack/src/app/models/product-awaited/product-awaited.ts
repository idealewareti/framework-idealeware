export class ProductAwaited{
  skuId: string;
  productName: string;
  name: string;
  email: string;
    
    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): ProductAwaited{
        let model = new ProductAwaited();
        
        for (var k in response){
            model[k] = response[k];
        }

        return model;
            
    }
    
}