import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Token } from "../models/customer/token";
import { Cart } from "../models/cart/cart";
import { environment } from "../../environments/environment";
import { CartItem } from "../models/cart/cart-item";
import { Service } from "../models/product-service/product-service";
import { CartShowCase } from "../models/cart-showcase/cart-showcase";
import { Shipping } from "../models/shipping/shipping";

@Injectable()
export class CartService {

    constructor(private client: HttpClientHelper) { }

    getCart(cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            if (!cartId) reject('Carrinho não encontrado');
            else {
                let url = `${environment.API_CART}/cart/${cartId}`;
                this.client.get(url)
                .map(res => res.json())
                .subscribe(response => {
                    let cart = new Cart(response);
                    resolve(cart);
                }, error => {                        
                    reject(error);
                });
            }
        });
    }

    createCart(cart: Cart, isPaint: boolean = false, sessionId: string = null, zipCode: number = 0): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let item = {};
            if(isPaint){
                item = {
                    "paint": {
                        "id": cart.paints[0].id,
                        "manufacturer": cart.paints[0].manufacturer,
                        "quantity": cart.paints[0].quantity
                    },
                    "zipCode": zipCode,
                    "sessionId": sessionId
                }
            }
            else{
                item = {
                    "product": {
                        "skuId": cart.products[0].sku.id,
                        "quantity": cart.products[0].quantity,
                        "feature": cart.products[0].sku.feature
                    },
                    "zipCode": zipCode,
                    "sessionId": sessionId
                }
            }
            let url = `${environment.API_CART}/cart`;
            this.client.post(url, item)
            .map(res => res.json())
            .subscribe(response => {
                let cart = new Cart(response);
                resolve(cart);
            }, error => reject(error));
        });
    }

    sendToCart(item: any, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CART}/cart/${cartId}/products`;
            this.client.post(url, item)
            .map(res => res.json())
            .subscribe(cart => {
                resolve(new Cart(cart))
            }, error => reject(error));
    })
    }

    sendServiceToCart(item, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CART}/cart/${cartId}/services`;
            this.client.post(url, item)
            .map(res => res.json())
            .subscribe(cart => {
                resolve(new Cart(cart))
            }, error => reject(error));
        })
    }

    updateItem(item: CartItem, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CART}/Cart/${cartId}/Products/${item.productItemId}/Quantity/${item.quantity}`;
            this.client.put(url, item)
            .map(res => res.json())
            .subscribe(cart => {
                resolve(new Cart(cart));
            }, error => reject(error));
        })
    }

    deleteItem(item: CartItem, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CART}/Cart/${cartId}/Products/${item.productItemId}`;
            this.client.delete(url)
            .map(res => res.json())
            .subscribe(cart => {
                resolve(new Cart(cart));
            }, error => reject(error));
        });
    }

    deleteService(serviceId: string, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CART}/Cart/${cartId}/Services/${serviceId}`;
            this.client.delete(url)
            .map(res => res.json())
            .subscribe(cart => {
                resolve(new Cart(cart));
            }, error => reject(error));
        });
    }

    updateItemService(item: Service, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CART}/Cart/${cartId}/Services/${item.id}/Quantity/${item.quantity}`;
            this.client.put(url, item)
            .map(res => res.json())
            .subscribe(cart => {
                resolve(new Cart(cart));
            }, error => reject(error));
        })
    }


    /* Cart Showcase */
    getCartShowCase(): Promise<CartShowCase> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CARTSHOWCASE}/cartshowcase`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                resolve(new CartShowCase(response));
            }, error => reject(error));
        });

    }

    setCustomerToCart(cartId: string, token: Token): Promise<Cart> {
        return new Promise((resolve, reject) => {
            if (cartId) {
                let url = `${environment.API_CART}/Cart/${cartId}/Customer`;
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

    setShipping(shipping: Shipping, cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CART}/cart/${cartId}/shipping`;
            this.client.post(url, shipping)
            .map(res => res.json())
            .subscribe(response => {
                let cart = new Cart(response);
                resolve(cart);
            }, error => reject(error));
        });
    }

    addDeliveryAddress(cartId: string, addressId: string, token: Token): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CART}/Cart/${cartId}/DeliveryAddress/${addressId}`;
            this.client.post(url, null, token)
            .map(res => res.json())
            .subscribe(response => {
                let cart = new Cart(response);
                resolve(cart);
            }, error => reject(error));
        });
    }

    addBillingAddress(cartId: string, addressId: string, token: Token): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CART}/Cart/${cartId}/BillingAddress/${addressId}`;
            this.client.post(url, null, token)
            .map(res => res.json())
            .subscribe(response => {
                let cart = new Cart(response);
                resolve(cart);
            }, error => reject(error));

        });
    }

    deleteCart(cartId: string): Promise<Cart> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CART}/Cart/${cartId}`;
            this.client.delete(url)
            .map(res => {
                resolve(new Cart());
            }, error => reject(error));
        });
    }


    /* Custom Paint */
    addPaint(paintId: string, manufacturer: string, quantity: number, cartId: string): Promise<Cart>{
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CART}/Cart/${cartId}/Paints/`;
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

    updatePaint(paint: CartItem, cartId: string): Promise<Cart>{
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CART}/Cart/${cartId}/Paints/${paint.id}/Quantity/${paint.quantity}`;
            this.client.put(url, null)
            .map(res => res.json())
            .subscribe(response => {
                resolve(new Cart(response));
            }, error => reject(error));
        });
    }

    deletePaint(paint: CartItem, cartId: string): Promise<Cart>{
         return new Promise((resolve, reject) => {
            let url = `${environment.API_CART}/Cart/${cartId}/Paints/${paint.id}`;
            this.client.delete(url)
            .map(res => res.json())
            .subscribe(cart => {
                resolve(new Cart(cart));
            }, error => reject(error));
        });
    }

}