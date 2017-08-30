export class PriceRange{
    maximumPrice: number;
    minimumPrice: number;

    constructor(maximumPrice: number =  null, minimumPrice: number = null){
        this.maximumPrice = maximumPrice;
        this.minimumPrice = minimumPrice;
    }


    toNumber(){
        this.maximumPrice = Number.parseFloat(this.maximumPrice.toString().replace(',', '.'))
        this.minimumPrice = Number.parseFloat(this.minimumPrice.toString().replace(',', '.'))
    }

}