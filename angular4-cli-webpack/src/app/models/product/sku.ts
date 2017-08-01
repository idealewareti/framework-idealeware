import {Variation} from './variation';
import {ProductPicture} from './product-picture';

export class Sku{
      id: string;
      idProduct: string;
      code: string;
      ean: string;
      stock: number;
      deadlineProductStranded: number;
      price: number;
      promotionalPrice: number;
      actualPrice: number;
      minimumStock: number;
      costPrice: number;
      initialPromotionalDate: Date;
      endPromotionalDate: Date;
      variations: Variation[] = [];
      installmentLimit: number;
      feature: string;
      available: boolean;
      picture: ProductPicture;
      pictures: ProductPicture[] = [];
      alternativePicture: ProductPicture;
      name: string;

      constructor(sku = null){
            if(sku) return this.CreateFromResponse(sku);
      }

      CreateFromResponse(object) : Sku{
            let sku = new Sku();

            for(var k in object){
                  if(k == 'variations'){
                        sku.variations = object.variations.map(v => new Variation(v));
                  }
                  else if(k == 'picture'){
                        sku.picture = new ProductPicture(object.picture);
                  }
                  else if(k == 'pictures'){
                        sku.pictures = object.pictures.map(p => p = new ProductPicture(p));
                  }
                  else if(k == 'alternativePicture')
                  {
                        sku.alternativePicture = new ProductPicture(object.alternativePicture);
                  }
                  else{
                        sku[k] = object[k];
                  }
            }

            let name = '';
            sku.variations.forEach(v => name += v.option.name + ' ');
            
            if(sku.promotionalPrice > 0)
                  sku.actualPrice = sku.promotionalPrice;
            else sku.actualPrice = sku.price;

            sku.name = name.trim();

            return sku;
      }
}