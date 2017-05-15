export class ProductPicture{
    id: string;
    productId: string;
    skuId: string;
    name: string;
    createdDate: Date;
    full: string;
    showcase: string;
    thumbnail: string;
    position: number;

    constructor(picture = null){
        if(picture)
            return this.createFromObject(picture);
    }

    private createFromObject(object) : ProductPicture{
        let picture = new ProductPicture();

        for (var k in object){
            picture[k] = object[k];
        }

        return picture;
    }
    
}