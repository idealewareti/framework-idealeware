export class CustomerProductRating{
    customerId: string;
    name: string;
    ratingTitle: string;
    note: number;
    comment: string;
    ratingStatus: number;
    approvedDate: Date;
    
    constructor(object = null){
        if(object) return this.createFromResponse(object);
    }

    public createFromResponse(response): CustomerProductRating{
        let model = new CustomerProductRating();
        
        for (var k in response){
            model[k] = response[k];
        }

        return model;
            
    }
    
}