import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '../helpers/httpclient'
import { Title } from '@angular/platform-browser';
import { AppSettings } from 'app/app.settings';
import { NgProgressService } from "ngx-progressbar";
import { CartShowCase } from '../models/cart-showcase/cart-showcase';
import { CartItem } from '../models/cart/cart-item';
import { Cart } from '../models/cart/cart';
import { Token } from "../models/customer/token";
import { Shipping } from "../models/shipping/shipping";
import { AppTexts } from "app/app.texts";
import { Service } from "../models/product-service/product-service";

@Injectable()
export class CartService {

    constructor(
        private client: HttpClient,
        private loader: NgProgressService

    ) { }


    public getSessionId(): string {
        return localStorage.getItem('session_id');
    }

    public setCartId(id: string) {
        localStorage.setItem('cart_id', id);
    }

    public getCartId(): string {
        return localStorage.getItem('cart_id');
    }

    public getZipcode(): number {
        if (localStorage.getItem('customer_zipcode'))
            return Number(localStorage.getItem('customer_zipcode').replace('-', ''));
        else return 0;
    }

    private getToken(): Token {
        let token = new Token();
        token.accessToken = localStorage.getItem('auth');
        token.tokenType = 'Bearer';
        return token;
    }

    public getCart(): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let id = this.getCartId();
            if (!id) reject('Carrinho não encontrado');
            else {
                let url = `${AppSettings.API_CART}/cart/${id}`;
                this.client.get(url)
                    .map(res => res.json())
                    .subscribe(response => {
                        let cart = new Cart(response);
                        resolve(cart);
                    }, error => {
                        if (error.response.status != 500) {
                            localStorage.removeItem('cart_id');
                            localStorage.removeItem('shopping_cart');
                        }

                        reject(error);
                    });
            }
        });
    }

    public createCart(cart: Cart, isPaint: boolean = false): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let item = {};
            if(isPaint){
                item = {
                    "paint": {
                        "id": cart.paints[0].id,
                        "manufacturer": cart.paints[0].manufacturer,
                        "quantity": cart.paints[0].quantity
                    },
                    "zipCode": Number(this.getZipcode()),
                    "sessionId": this.getSessionId()
                }
            }
            else{
                item = {
                    "product": {
                        "skuId": cart.products[0].sku.id,
                        "quantity": cart.products[0].quantity,
                        "feature": cart.products[0].sku.feature
                    },
                    "zipCode": Number(this.getZipcode()),
                    "sessionId": this.getSessionId()
                }
            }
            let url = `${AppSettings.API_CART}/cart`;
            this.client.post(url, item)
                .map(res => res.json())
                .subscribe(response => {
                    let cart = new Cart(response);
                    this.setCartId(cart.id);
                    resolve(cart);
                }, error => reject(error));
        });
    }

    public sendToCart(item): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CART}/cart/${this.getCartId()}/products`;
            this.client.post(url, item)
                .map(res => res.json())
                .subscribe(cart => {
                    resolve(new Cart(cart))
                }, error => reject(error));
        })
    }

    public sendServiceToCart(item): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CART}/cart/${this.getCartId()}/services`;
            this.client.post(url, item)
                .map(res => res.json())
                .subscribe(cart => {
                    resolve(new Cart(cart))
                }, error => reject(error));
        })
    }

    public updateItem(item: CartItem): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CART}/Cart/${this.getCartId()}/Products/${item.productItemId}/Quantity/${item.quantity}`;
            this.client.put(url, item)
                .map(res => res.json())
                .subscribe(cart => {
                    resolve(new Cart(cart));
                }, error => reject(error));
        })
    }

    public deleteItem(item: CartItem): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CART}/Cart/${this.getCartId()}/Products/${item.productItemId}`;
            this.client.delete(url)
                .map(res => res.json())
                .subscribe(cart => {
                    resolve(new Cart(cart));
                }, error => reject(error));
        });
    }

    public deleteService(serviceId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CART}/Cart/${this.getCartId()}/Services/${serviceId}`;
            this.client.delete(url)
                .map(res => res.json())
                .subscribe(cart => {
                    resolve(new Cart(cart));
                }, error => reject(error));
        });
    }

    public updateItemService(item: Service): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CART}/Cart/${this.getCartId()}/Services/${item.id}/Quantity/${item.quantity}`;
            this.client.put(url, item)
                .map(res => res.json())
                .subscribe(cart => {
                    resolve(new Cart(cart));
                }, error => reject(error));
        })
    }


    /* Cart Showcase */
    public getCartShowCase(): Promise<CartShowCase> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CARTSHOWCASE}/cartshowcase`;
            this.client.get(url)
                .map(res => res.json())
                .subscribe(response => {
                    resolve(new CartShowCase(response));
                }, error => reject(error));
        });

    }

    public setCustomerToCart(): Promise<Cart> {
        return new Promise((resolve, reject) => {
            if (this.getCartId()) {
                let token = this.getToken();
                let cartId = this.getCartId();
                let url = `${AppSettings.API_CART}/Cart/${cartId}/Customer`;
                this.client.post(url, null, token)
                    .map(res => res.json())
                    .subscribe(response => {
                        let cart = new Cart(response);
                        resolve(cart);
                    }, error => reject(error));
            }
            else {
                resolve(new Cart());
            }
        })
    }

    public setShipping(shipping: Shipping): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CART}/cart/${this.getCartId()}/shipping`;
            this.client.post(url, shipping)
                .map(res => res.json())
                .subscribe(response => {
                    let cart = new Cart(response);
                    resolve(cart);
                }, error => reject(error));
        });
    }

    public addDeliveryAddress(cartId: string, addressId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CART}/Cart/${cartId}/DeliveryAddress/${addressId}`;
            this.client.post(url, null, this.getToken())
                .map(res => res.json())
                .subscribe(response => {
                    let cart = new Cart(response);
                    resolve(cart);
                }, error => reject(error));

        });
    }

    public addBillingAddress(cartId: string, addressId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CART}/Cart/${cartId}/BillingAddress/${addressId}`;
            this.client.post(url, null, this.getToken())
                .map(res => res.json())
                .subscribe(response => {
                    let cart = new Cart(response);
                    resolve(cart);
                }, error => reject(error));

        });
    }

    public deleteCart(cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CART}/Cart/${cartId}`;
            this.client.delete(url)
                .map(res => {
                    resolve(new Cart());
                }, error => reject(error));
        });
    }


    /* Custom Paint */
    addPaint(paintId: string, manufacturer: string, quantity: number): Promise<Cart>{
        return new Promise((resolve, reject) => {
            let cartId = this.getCartId();
            let url = `${AppSettings.API_CART}/Cart/${cartId}/Paints/`;
            let item = {
                "id": paintId,
                "manufacturer": manufacturer,
                "quantity": quantity
            };
            this.client.post(url, item)
            .map(res => res.json())
            .subscribe(response => {
                resolve(new Cart(response));
            }, error => reject(error));
        });
    }

    updatePaint(paint: CartItem): Promise<Cart>{
        return new Promise((resolve, reject) => {
            let cartId = this.getCartId();
            let url = `${AppSettings.API_CART}/Cart/${cartId}/Paints/${paint.id}/Quantity/${paint.quantity}`;
            this.client.put(url, null)
            .map(res => res.json())
            .subscribe(response => {
                resolve(new Cart(response));
            }, error => reject(error));
        });
    }

    deletePaint(paint: CartItem): Promise<Cart>{
         return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CART}/Cart/${this.getCartId()}/Paints/${paint.id}`;
            this.client.delete(url)
                .map(res => res.json())
                .subscribe(cart => {
                    resolve(new Cart(cart));
                }, error => reject(error));
        });
    }

}