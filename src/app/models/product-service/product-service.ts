export class Service{
      id: string;
      serviceType: string;
      rules: string;
      price: number;
      quantity: number = 0;
      totalPrice: number;
      unitType: number;
      totalUnitPrice: number;
      totalDiscountPrice: number;

    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): Service{
        let model = new Service();
        
        for (var k in response){
            model[k] = response[k];
        }

        return model;
            
    }
}