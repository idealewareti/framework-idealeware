import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { CartItem } from '../models/cart/cart-item';
import { Cart } from '../models/cart/cart';
import { Product } from '../models/product/product';
import { Sku } from '../models/product/sku';
import { Shipping } from "../models/shipping/shipping";
import { Service } from "../models/product-service/product-service";
import { CustomPaintCombination } from "../models/custom-paint/custom-paint-combination";
import { Token } from '../models/customer/token';
import { isPlatformBrowser } from '@angular/common';

declare var toastr: any;

@Injectable()
export class CartManager {
    private cart: Cart;
    private serviceProduct: Service[] = [];

    constructor(private service: CartService, @Inject(PLATFORM_ID) private platformId: Object) { }

    private getToken(): Token {
        let token = new Token();
        if(isPlatformBrowser(this.platformId)) {
            token.accessToken = localStorage.getItem('auth');
            token.createdDate = new Date(localStorage.getItem('auth_create'));
            token.expiresIn = Number(localStorage.getItem('auth_expires'));
            token.tokenType = 'Bearer';
        }
        return token;
    }

    private getZipcode(): number {
        if(isPlatformBrowser(this.platformId)) {
            if (localStorage.getItem('customer_zipcode'))
                return Number(localStorage.getItem('customer_zipcode').replace('-', ''));
            return 0;
        }
        return 0;         
    }

    private getSessionId(): string {
        if(isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('session_id');
        }
        return null;
    }

    setCartId(id: string) {
        if(isPlatformBrowser(this.platformId)) {
            localStorage.setItem('cart_id', id);
        }
    }

    getCartId(): string {
        if(isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('cart_id');
        }            
        return null;
    }

    getCart(cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            if (!cartId) {
                console.log('Carrinho não encontrado');
                resolve(new Cart());
            }
            else {
                this.service.getCart(cartId)
                .subscribe(cart => {
                    resolve(cart);
                }, error => {
                    reject(error);
                });
            }
        });
    }

    purchase(cartId: string, product: Product, sku: Sku, quantity: number, feature: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            if (cartId) {
                console.log('Cart exists');
                this.getCart(cartId)
                .then(cart => {
                    console.log('Adding item to cart');
                    return this.addItem(cartId, sku.id, quantity, feature);
                })
                .then(cart => {
                    console.log('Item added to cart');
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
                    resolve(response);
                })
                .catch(error => reject(error));
            }
        });
    }

    purchasePaint(cartId: string, paint: CustomPaintCombination, manufacturer: string, quantity: number): Promise<Cart>{
        return new Promise((resolve, reject) => {
            console.log('Checking if cart exists');
            if (cartId) {
                console.log('Cart exists');
                this.getCart(cartId)
                .then(cart => {
                    console.log('Adding item to cart');
                    return this.addPaint(paint.id, manufacturer, quantity, cart.id);
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

    addPaint(paintId: string, manufacturer: string, quantity: number, cartId: string): Promise<Cart>{
        return new Promise((resolve, reject) => {
            this.service.addPaint(paintId, manufacturer, quantity, cartId)
            .subscribe(cart => {
               resolve(cart);
            }, error => reject(error));
        });
    }

    addItem(cartId: string, skuId: string, quantity: number, feature: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let item = {
                "skuId": skuId,
                "quantity": quantity,
                "feature": feature
            };
            this.service.sendToCart(item, cartId)
            .subscribe(cart => {
                resolve(cart)
            }, error => reject(error));
        });
    }

    addService(serviceId: string, quantity: number, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let item = {
                "serviceId": serviceId,
                "quantity": quantity
            };
            this.service.sendServiceToCart(item, cartId)
            .subscribe(cart => {
                resolve(cart)
            }, error => reject(error));            
        });
    }

    createCart(cart: Cart, isPaint: boolean = false): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let session_id: string = this.getSessionId();
            let zipCode: number = this.getZipcode();
            this.service.createCart(cart, isPaint, session_id, zipCode)
            .subscribe(response => {
                this.setCartId(response.id);
                resolve(response);
            }, error => reject(error));
        });
    }

    updateItem(item: CartItem, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.updateItem(item, cartId)
            .subscribe(cart => {
                resolve(cart);
            }, error => reject(error));
        });
    }

    updateItemService(item: Service, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.updateItemService(item, cartId)
            .subscribe(cart => {
                resolve(cart);
            }, error => reject(error));
        });
    }

    updatePaint(item: CartItem, cartId: string): Promise<Cart>{
        return new Promise((resolve, reject) => {
            this.service.updatePaint(item, cartId)
            .subscribe(cart => {
                resolve(cart);
            }, error => reject(error));
        });
    }

    deleteItem(item: CartItem, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.deleteItem(item, cartId)
            .subscribe(cart => {
                resolve(cart);
            }, error => reject(error));
        });
    }

    deleteService(serviceId: string, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.deleteService(serviceId, cartId)
            .subscribe(cart => {
                resolve(cart);
            }, error => reject(error));
        });
    }

    deletePaint(item: CartItem, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.deletePaint(item, cartId)
            .subscribe(cart => {
                resolve(cart);
            }, error => reject(error));
        });
    }

    setShipping(shipping: Shipping, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            this.service.setShipping(shipping, cartId)
            .subscribe(cart => {
                resolve(cart);
            }, error => reject(error));
        });
    }

    setCustomerToCart(cartId: string): Promise<Cart>{
        return new Promise((resolve, reject) => {
            let token = this.getToken();
            this.service.setCustomerToCart(cartId, token)
            .subscribe(cart => {
                resolve(cart);
            }, error => reject(error));
        })
    }

    addDeliveryAddress(cartId: string, addressId: string): Promise<Cart>{
        return new Promise((resolve, reject) => {
            let token = this.getToken();
            this.service.addDeliveryAddress(cartId, addressId, token)
            .subscribe(cart => {
                resolve(cart);
            }, error => reject(error));
        });
    }

    addBillingAddress(cartId: string, addressId: string): Promise<Cart>{
        return new Promise((resolve, reject) => {
            let token = this.getToken();
            this.service.addBillingAddress(cartId, addressId, token)
            .subscribe(cart => {
                resolve(cart);
            }, error => reject(error));
        });
    }
}