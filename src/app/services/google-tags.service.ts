import { Injectable } from '@angular/core';

import { Product } from "../models/product/product";
import { Sku } from '../models/product/sku';
import { CartItem } from '../models/cart/cart-item';
import { ProductService } from './product.service';
import { Cart } from '../models/cart/cart';
import { Shipping } from '../models/shipping/shipping';

declare var dataLayer: any;

@Injectable({
    providedIn: 'root'
})
export class GoogleTagsService {
    constructor(
        private produtoService: ProductService
    ) { }

    viewItem(product: Product, sku: Sku) {
        dataLayer.push({
            event: 'viewItem',
            ecommerce: {
                currencyCode: 'BRL',
                add: {
                    products: [{
                        id: sku.code,
                        name: sku.name,
                        list_name: product.baseCategory.name,
                        price: sku.price,
                        brand: product.brand,
                        category: product.baseCategory.name,
                        variant: sku.variations.map(v => v.option.name).join(", "),
                    }]
                }
            }
        });
    }

    viewPromotion(product: Product, sku: Sku) {
        dataLayer.push({
            'event': 'viewPromotion',
            'ecommerce': {
                'currencyCode': 'BRL',
                'add': {
                    'products': [{
                        'id': sku.code,
                        'name': sku.campaignName ? sku.campaignName : 'Preço promoção'
                    }]
                }
            }
        });
    }

    removeFromCart(item: CartItem) {
        dataLayer.push({
            'event': 'removeFromCart',
            'ecommerce': {
                'currencyCode': 'BRL',
                'add': {
                    'products': [{
                        'id': item.sku.code,
                        'name': item.name,
                        'variant': item.sku.variations.map(v => v.option.name).join(", "),
                        'price': item.sku.price
                    }]
                }
            }
        });
    }

    addToCart(product: Product, sku: Sku) {
        dataLayer.push({
            'event': 'addToCart',
            'ecommerce': {
                'currencyCode': 'BRL',
                'add': {
                    'products': [{
                        'id': sku.code,
                        'name': product.name,
                        'list_name': product.baseCategory.name,
                        'brand': product.brand,
                        'category': product.baseCategory.name,
                        'variant': sku.variations.map(v => v.option.name).join(", "),
                        'price': sku.price
                    }]
                }
            }
        });
    }

    checkoutProgress(cart: Cart) {
        let itensCart: any[] = [];

        for (let item of cart.products) {
            itensCart.push({
                'id': item.sku.id,
                'name': item.sku.name,
                'variant': item.sku.variations.map(v => v.option.name).join(", "),
                'quantity': item.quantity,
                'price': item.totalPrice
            });
        };

        dataLayer.push({
            'event': 'checkoutProgress',
            'ecommerce': {
                'items': itensCart,
                'coupon': this.getStringCouponsCart(cart)
            }
        });
    }

    setCheckoutOption(shipping: Shipping) {
        dataLayer.push({
            'event': 'setCheckoutOption',
            'ecommerce': {
                "checkout_step": 1,
                "checkout_option": shipping.deliveryInformation.deliveryMethodName,
                "value": shipping.deliveryInformation.deliveryProviderName
            }
        });
    }

    private getStringCouponsCart(cart: Cart) {
        if (cart.coupons) {
            if (cart.coupons.length > 1)
                return cart.coupons.join(' ');
            else
                return '';
        }
    }
}