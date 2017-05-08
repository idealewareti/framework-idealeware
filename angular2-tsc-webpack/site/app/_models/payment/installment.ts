export class Installment{
    
    id: string;
    number: number;
    interest: number;
    description: string;
    totalPrice: number;
    installmentPrice: number;

    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): Installment{
        let model = new Installment();
        
        for (var k in response){
            model[k] = response[k];
        }

        return model;
            
    }
}