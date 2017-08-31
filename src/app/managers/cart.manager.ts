import { Injectable } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { CartItem } from '../models/cart/cart-item';
import { Cart } from '../models/cart/cart';
import { Product } from '../models/product/product';
import { Sku } from '../models/product/sku';
import { Shipping } from "../models/shipping/shipping";
import { Service } from "../models/product-service/product-service";
import { CustomPaintCombination } from "app/models/custom-paint/custom-paint-combination";

declare var toastr: any;

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

    purchasePaint(paint: CustomPaintCombination, manufacturer: string, quantity: number): Promise<Cart>{
        return new Promise((resolve, reject) => {
            console.log('Checking if cart exists');
            if (this.service.getCartId()) {
                console.log('Cart exists');
                this.service.getCart()
                .then(cart => {
                    console.log('Adding item to cart');
                    return this.addPaint(paint.id, manufacturer, quantity);
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
                let cartItem = paint.exportAsPaint();
                cartItem.quantity = quantity;
                cartItem.manufacturer = manufacturer;
                cart.paints.push(cartItem);
                console.log('Creating new cart');
                this.createCart(cart, true)
                .then(response => {
                    console.log('Cart successful created');
                    localStorage.setItem('shopping_cart', JSON.stringify(cart));
                    resolve(cart);
                })
                .catch(error => reject(error));
            }
        });
    }

    addPaint(paintId: string, manufacturer: string, quantity: number): Promise<Cart>{
        return this.service.addPaint(paintId, manufacturer, quantity);
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

    createCart(cart: Cart, isPaint: boolean = false): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.createCart(cart, isPaint)
            .then(response => {
                resolve(response);
            })
            .catch(error => reject(error));
        });
    }

    updateItem(item: CartItem): Promise<Cart> {
        return new Promise((resolve, reject) => {
            if (item.quantity != null && item.quantity > 0) {
                this.service.updateItem(item)
                .then(cart => {
                    localStorage.setItem('shopping_cart', JSON.stringify(cart));
                    resolve(cart);
                })
                .catch(error => reject(error));
            }
            else{
                let cart = new Cart(JSON.parse(localStorage.getItem('shopping_cart')));
                resolve(cart);
            }

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

    updatePaint(item: CartItem): Promise<Cart>{
        return new Promise((resolve, reject) => {
            this.service.updatePaint(item)
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
                if (cart.products.length > 0 || cart.paints) {
                toastr['warning']('Produto removido do carrinho');
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
                toastr['warning']('Serviço removido do carrinho');
                localStorage.setItem('shopping_cart', JSON.stringify(cart));
                resolve(cart);
            })
            .catch(error => reject(error));
        });
    }

    deletePaint(item: CartItem): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.deletePaint(item)
            .then(cart => {

                if (cart.paints.length > 0 || cart.products) {
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

    setCustomerToCart(): Promise<Cart>{
        return this.service.setCustomerToCart();
    }

    addDeliveryAddress(cartId: string, addressId: string): Promise<Cart>{
        return this.service.addDeliveryAddress(cartId, addressId);
    }

    addBillingAddress(cartId: string, addressId: string): Promise<Cart>{
        return this.service.addBillingAddress(cartId, addressId);
    }
}