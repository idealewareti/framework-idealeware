import { CustomerProductRating } from "./customer-product-rating";

export class ProductRating {
    id: string;
    name: string;
    customers: CustomerProductRating[] = [];
    
    
    constructor(ProductRating = null){
        if(ProductRating) return this.createFromResponse(ProductRating);
    }

    public createFromResponse(object): ProductRating{
        let productRating = new ProductRating();
        
         for(var k in object){
            if(k == 'customers'){
                productRating.customers = object.customers.map(o => o = new CustomerProductRating(o));
            }
            else{
                productRating[k] = object[k];
            }
        }
        return productRating;
    }
}