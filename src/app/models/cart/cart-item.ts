import { Sku } from '../product/sku';
import { Product } from '../product/product';

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
    isPackageProduct: boolean;
    
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
}

