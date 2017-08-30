export class ProductReference{
    skuId: string;
    productId: string;
    productName: string;
    productCode: string;
    optionName: string;
    rgb: string;

    constructor(filter = null){
        if(filter) return this.createFromResponse(filter);
    }

    createFromResponse(response): ProductReference{
        let model = new ProductReference();

        for(let k in response){
            model[k] = response[k];
        }

        return model;
    }
}
