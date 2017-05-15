import { Injectable } from '@angular/core';
import { CartService } from '../_services/cart.service';
import { ProductService } from '../_services/product.service';
import { CartItem } from '../_models/cart/cart-item';
import { Cart } from '../_models/cart/cart';
import { Product } from '../_models/product/product';
import { Sku } from '../_models/product/sku';
import { Shipping } from "../_models/shipping/shipping";
import { Service } from "../_models/product-service/product-service";

@Injectable()
export class CartManager {
    private cart: Cart;
    private serviceProduct: Service[] = [];

    constructor(
        private service: CartService
    ) { }

    public getCart(): Promise<Cart> {
        return new Promise((resolve, reject) => {
            if (!this.service.getCartId()) {
                localStorage.removeItem('shopping_cart');
                resolve(new Cart());
            }
            else {
                this.service.getCart()
                    .then(cart => {
                        localStorage.setItem('shopping_cart', JSON.stringify(cart));
                        resolve(cart);
                    })
                    .catch(e => reject(e));
            }
        });
    }

    public getCartId(): string {
        return this.service.getCartId();
    }

    public getSessionId(): string {
        return this.service.getSessionId();
    }

    purchase(product: Product, sku: Sku, quantity: number, feature: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            if (this.service.getCartId()) {
                console.log('Cart exists');
                this.service.getCart()
                    .then(cart => {
                        console.log('Adding item to cart');
                        return this.addItem(sku.id, quantity, feature);
                    })
                    .then(cart => {
                        console.log('Item added to cart');
                        localStorage.setItem('shopping_cart', JSON.stringify(cart));
                        resolve(cart);
                    })
                    .catch(error => reject(error));
            }
            else {
                console.log(`Cart doen't exists`);
                let cart = new Cart();
                let cartItem = new CartItem().createFromProduct(product, sku, feature, quantity);
                cart.products.push(cartItem);
                console.log('Creating new cart');
                this.createCart(cart)
                    .then(response => {
                        console.log('Cart successful created');
                        localStorage.setItem('shopping_cart', JSON.stringify(cart));
                        resolve(cart);
                    })
                    .catch(error => reject(error));
            }
        });
    }

    addItem(skuId: string, quantity: number, feature: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let item = {
                "skuId": skuId,
                "quantity": quantity,
                "feature": feature
            };
            this.service.sendToCart(item)
                .then(cart => {
                    localStorage.setItem('shopping_cart', JSON.stringify(cart));
                    resolve(cart);
                })
                .catch(error => reject(error));
        });
    }

    addService(serviceId: string, quantity: number): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let item = {
                "serviceId": serviceId,
                "quantity": quantity
            };
            this.service.sendServiceToCart(item)
                .then(cart => {
                    localStorage.setItem('shopping_cart', JSON.stringify(cart));
                    resolve(cart);
                })
                .catch(error => reject(error));
        });
    }

    createCart(cart: Cart): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.createCart(cart)
                .then(response => {
                    resolve(response);
                })
                .catch(error => reject(error));
        });
    }

    updateItem(item: CartItem): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.updateItem(item)
                .then(cart => {
                    localStorage.setItem('shopping_cart', JSON.stringify(cart));
                    resolve(cart);
                })
                .catch(error => reject(error));
        });
    }

    updateItemService(item: Service): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.updateItemService(item)
                .then(cart => {
                    localStorage.setItem('shopping_cart', JSON.stringify(cart));
                    resolve(cart);
                })
                .catch(error => reject(error));
        });
    }

    deleteItem(item: CartItem): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.deleteItem(item)
                .then(cart => {

                    if (cart.products.length > 0) {
                        localStorage.setItem('shopping_cart', JSON.stringify(cart));
                        return cart;
                    }
                })
                .then((cart) => {
                    if (cart == null || cart.id == null) {
                        this.service.deleteCart(this.getCartId.toString());
                        localStorage.removeItem('shopping_cart');
                        localStorage.removeItem('cart_id');
                    }
                    resolve(cart);
                })
                .catch(error => reject(error));
        });
    }

    deleteService(serviceId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.deleteService(serviceId)
                .then(cart => {
                    localStorage.setItem('shopping_cart', JSON.stringify(cart));
                    resolve(cart);
                })
                .catch(error => reject(error));
        });
    }

    setShipping(shipping: Shipping): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.setShipping(shipping)
                .then(cart => {
                    localStorage.setItem('shopping_cart', JSON.stringify(cart));
                    resolve(cart);
                })
                .catch(error => reject(error));
        });
    }
}