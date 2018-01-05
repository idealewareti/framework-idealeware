import { ProductPicture } from '../product/product-picture';
import { Product } from '../product/product';
import { Sku } from '../product/sku';
import { CustomPaintCombination } from '../custom-paint/custom-paint-combination';

export class CartItem {
    productItemId: string;
    id: string;
    name: string;
    description: string;
    selfColor: boolean;
    installmentLimit: number;
    additionalFreightPrice: number;
    daysProcessing: number;
    areaSizer: number;
    lossPercentage: number;
    sku: Sku;
    status: boolean;
    quantity: number;
    totalUnitPrice: number;
    totalDiscountPrice: number;
    totalPrice: number;
    dateAddCart: Date;
    //CustomPaint
    manufacturer: string;
    optionCode: string;
    optionHeight: number;
    optionId: string;
    optionLength: number;
    optionName: string;
    optionPicture: string;
    optionStatus: boolean;
    optionWeight: number;
    optionWidth: number;
    variationName: string;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    createFromResponse(object) {
        let model = new CartItem();

        for (var k in object) {
            if (k == 'sku') {
                model.sku = new Sku(object.sku);
            }
            else {
                model[k] = object[k];
            }
        }

        return model;
    }

    createFromProduct(product: Product, sku: Sku, feature: string, quantity: number): CartItem {
        let item = new CartItem();
        item.productItemId = product.id;
        item.name = product.name;
        item.description = product.description;
        item.selfColor = product.selfColor;
        item.installmentLimit = product.installmentLimit;
        item.additionalFreightPrice = product.additionalFreightPrice;
        item.daysProcessing = product.daysProcessing;
        item.areaSizer = product.areaSizer;
        item.lossPercentage = product.lossPercentage;
        item.status = product.status;
        item.quantity = quantity;
        item.sku = sku;
        item.sku.feature = feature;
        return item;
    }

    createFromPaint(paint: CustomPaintCombination, manufacturer: string, quantity: number): CartItem {
        let item = new CartItem();
        item.id = paint.id;
        item.manufacturer = manufacturer;
        item.quantity = quantity;

        return item;
    }
}

