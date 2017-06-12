export class DeliveryInformation{
      quotId: string;
      deliveryMethodId: string;
      shippingCost: number;
      providerShippingCost: number;
      deliveryMethodName: string;
      deliveryProviderName: string;
      deliveryEstimatedDate: Date;
      deliveryEstimatedDateMax: Date;
      deliveryEstimateBusinessDays: number;
    
    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): DeliveryInformation{
        let model = new DeliveryInformation();
        
        for (var k in response){
            model[k] = response[k];
        }

        return model;
            
    }
    
}