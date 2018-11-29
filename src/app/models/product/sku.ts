import { Variation } from './variation';
import { ProductPicture } from './product-picture';
import { AxisX } from '../../enums/axis-x.enum';
import { AxisY } from '../../enums/axis-y.enum';

export class Sku {
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
      variations: Variation[];
      installmentLimit: number;
      feature: string;
      available: boolean;
      picture: ProductPicture;
      pictures: ProductPicture[];
      alternativePicture: ProductPicture;
      name: string;
      quantity: number;
      isPackageProduct: boolean;
      width: number;
      height: number;
      length: number;
      weight: number;
      additionalFreightPrice: number;
      daysProcessing: number;
      campaignName: string;
      imageTag: string;
      axisX: AxisX;
      axisY: AxisY;

      constructor(sku = null) {
            if (sku) return this.CreateFromResponse(sku);
      }

      CreateFromResponse(object): Sku {
            let sku = new Sku();

            for (var k in object) {
                  if (k == 'variations') {
                        sku.variations = object.variations.map(v => new Variation(v));
                  }
                  else if (k == 'picture') {
                        sku.picture = new ProductPicture(object.picture);
                  }
                  else if (k == 'pictures') {
                        sku.pictures = object.pictures.map(p => p = new ProductPicture(p));
                  }
                  else if (k == 'alternativePicture') {
                        sku.alternativePicture = new ProductPicture(object.alternativePicture);
                  }
                  else {
                        sku[k] = object[k];
                  }
            }

            let name = '';
            sku.variations.forEach(v => name += v.option.name + ' ');

            if (sku.promotionalPrice > 0)
                  sku.actualPrice = sku.promotionalPrice;
            else sku.actualPrice = sku.price;

            sku.name = name.trim();

            return sku;
      }
}