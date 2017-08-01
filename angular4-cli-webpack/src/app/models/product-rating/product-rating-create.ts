import { CustomerProductRating } from "./customer-product-rating";

export class ProductRatingCreate {
    id: string;
    name: string;
    customers: CustomerProductRating = new CustomerProductRating();
    
    
    constructor(ProductRating = null){
        if(ProductRating) return this.createFromResponse(ProductRating);
    }

    public createFromResponse(object): ProductRatingCreate{
        let productRating = new ProductRatingCreate();
        
         for(var k in object){
            if(k == 'customer'){
                productRating.customers = new CustomerProductRating(object.customer);
            }
            else{
                productRating[k] = object[k];
            }
        }
        return productRating;
    }
}