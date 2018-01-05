import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Token } from "../models/customer/token";
import { Cart } from "../models/cart/cart";
import { environment } from "../../environments/environment";
import { CartItem } from "../models/cart/cart-item";
import { Service } from "../models/product-service/product-service";
import { CartShowCase } from "../models/cart-showcase/cart-showcase";
import { Shipping } from "../models/shipping/shipping";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class CartService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getCart(cartId: string): Observable<Cart> {
        let url = `${environment.API_CART}/cart/${cartId}`;
        return this.client.get(url)
            .map(res => res.json())
    }

    createCart(cart: Cart, isPaint: boolean = false, sessionId: string = null, zipCode: number = 0, origin: string = null): Observable<Cart> {
        let item = {};
        if (isPaint) {
            item = {
                "paint": {
                    "id": cart.paints[0].id,
                    "manufacturer": cart.paints[0].manufacturer,
                    "quantity": cart.paints[0].quantity
                },
                "zipCode": zipCode,
                "origin": origin,
                "sessionId": sessionId
            }
        }
        else {
            item = {
                "product": {
                    "skuId": cart.products[0].sku.id,
                    "quantity": cart.products[0].quantity,
                    "feature": cart.products[0].sku.feature
                },
                "zipCode": zipCode,
                "origin": origin,
                "sessionId": sessionId
            }
        }
        let url = `${environment.API_CART}/cart`;
        return this.client.post(url, item)
            .map(res => res.json())
    }

    sendToCart(item: any, cartId: string): Observable<Cart> {
        let url = `${environment.API_CART}/cart/${cartId}/products`;
        return this.client.post(url, item)
            .map(res => res.json());
    }

    sendServiceToCart(item, cartId: string): Observable<Cart> {
        let url = `${environment.API_CART}/cart/${cartId}/services`;
        return this.client.post(url, item)
            .map(res => res.json());
    }

    updateItem(item: CartItem, cartId: string): Observable<Cart> {
        let url = `${environment.API_CART}/Cart/${cartId}/Products/${item.productItemId}/Quantity/${item.quantity}`;
        return this.client.put(url, item)
            .map(res => res.json());
    }

    deleteItem(item: CartItem, cartId: string): Observable<Cart> {
        let url = `${environment.API_CART}/Cart/${cartId}/Products/${item.productItemId}`;
        return this.client.delete(url)
            .map(res => res.json())
    }

    deleteService(serviceId: string, cartId: string): Observable<Cart> {
        let url = `${environment.API_CART}/Cart/${cartId}/Services/${serviceId}`;
        return this.client.delete(url)
            .map(res => res.json())
    }

    updateItemService(item: Service, cartId: string): Observable<Cart> {
        let url = `${environment.API_CART}/Cart/${cartId}/Services/${item.id}/Quantity/${item.quantity}`;
        return this.client.put(url, item)
            .map(res => res.json());
    }

    setCustomerToCart(cartId: string, token: Token): Observable<Cart> {
        let url = `${environment.API_CART}/Cart/${cartId}/Customer`;
        return this.client.post(url, null, token)
            .map(res => res.json());
    }

    setShipping(shipping: Shipping, cartId: string): Observable<Cart> {
        let url = `${environment.API_CART}/cart/${cartId}/shipping`;
        return this.client.post(url, shipping)
            .map(res => res.json());
    }

    addDeliveryAddress(cartId: string, addressId: string, token: Token): Observable<Cart> {
        let url = `${environment.API_CART}/Cart/${cartId}/DeliveryAddress/${addressId}`;
        return this.client.post(url, null, token)
            .map(res => res.json())
    }

    addBillingAddress(cartId: string, addressId: string, token: Token): Observable<Cart> {
        let url = `${environment.API_CART}/Cart/${cartId}/BillingAddress/${addressId}`;
        return this.client.post(url, null, token)
            .map(res => res.json());
    }

    deleteCart(cartId: string): Observable<Cart> {
        let url = `${environment.API_CART}/Cart/${cartId}`;
        return this.client.delete(url)
            .map(res => res.json());
    }


    /* Custom Paint */
    addPaint(paintId: string, manufacturer: string, quantity: number, cartId: string): Observable<Cart> {
        let url = `${environment.API_CART}/Cart/${cartId}/Paints/`;
        let item = {
            "id": paintId,
            "manufacturer": manufacturer,
            "quantity": quantity
        };
        return this.client.post(url, item)
            .map(res => res.json());
    }

    updatePaint(paint: CartItem, cartId: string): Observable<Cart> {
        let url = `${environment.API_CART}/Cart/${cartId}/Paints/${paint.id}/Quantity/${paint.quantity}`;
        return this.client.put(url, null)
            .map(res => res.json());
    }

    deletePaint(paint: CartItem, cartId: string): Observable<Cart> {
        let url = `${environment.API_CART}/Cart/${cartId}/Paints/${paint.id}`;
        return this.client.delete(url)
            .map(res => res.json());
    }

}