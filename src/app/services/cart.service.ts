import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Cart } from "../models/cart/cart";
import { environment } from "../../environments/environment";
import { CartItem } from "../models/cart/cart-item";
import { Service } from "../models/product-service/product-service";
import { Shipping } from "../models/shipping/shipping";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
	providedIn: 'root'
})
export class CartService {
	client: HttpClientHelper;

	constructor(http: HttpClient) {
		this.client = new HttpClientHelper(http);
	}

	getCart(cartId: string): Observable<Cart> {
		let url = `${environment.API_CART}/cart/${cartId}`;
		return this.client.get(url);
	}

	createCart(cart: Cart, sessionId: string = null, zipCode: number = 0, origin: string = null): Observable<Cart> {
		let item = {
			"product": {
				"skuId": cart.products[0].sku.id,
				"quantity": cart.products[0].quantity,
				"feature": cart.products[0].sku.feature
			},
			"zipCode": zipCode,
			"origin": origin,
			"sessionId": sessionId
		};

		let url = `${environment.API_CART}/cart`;
		return this.client.post(url, item)
			.pipe(map(res => res.body));
	}

	sendToCart(item: any, cartId: string): Observable<Cart> {
		let url = `${environment.API_CART}/cart/${cartId}/products`;
		return this.client.post(url, item)
			.pipe(map(res => res.body));
	}

	sendServiceToCart(item, cartId: string): Observable<Cart> {
		let url = `${environment.API_CART}/cart/${cartId}/services`;
		return this.client.post(url, item)
			.pipe(map(res => res.body));
	}

	updateItem(item: CartItem, cartId: string): Observable<Cart> {
		let url = `${environment.API_CART}/Cart/${cartId}/Products/${item.productItemId}/Quantity/${item.quantity}`;
		return this.client.put(url, item);
	}

	updateIsPackageItem(item: CartItem, cartId: string): Observable<Cart> {
		let url = `${environment.API_CART}/Cart/${cartId}/Products/${item.productItemId}/IsPackageProduct/${item.isPackageProduct}`;
		return this.client.put(url, item);
	}

	updateItemService(item: Service, cartId: string): Observable<Cart> {
		let url = `${environment.API_CART}/Cart/${cartId}/Services/${item.id}/Quantity/${item.quantity}`;
		return this.client.put(url, item);
	}

	deleteItem(item: CartItem, cartId: string): Observable<Cart> {
		let url = `${environment.API_CART}/Cart/${cartId}/Products/${item.productItemId}`;
		return this.client.delete(url);
	}

	deleteService(serviceId: string, cartId: string): Observable<Cart> {
		let url = `${environment.API_CART}/Cart/${cartId}/Services/${serviceId}`;
		return this.client.delete(url);
	}

	setCustomerToCart(cartId: string): Observable<Cart> {
		let url = `${environment.API_CART}/Cart/${cartId}/Customer`;
		return this.client.post(url)
			.pipe(map(res => res.body));
	}

	setShipping(shipping: Shipping, cartId: string): Observable<Cart> {
		let url = `${environment.API_CART}/cart/${cartId}/shipping`;
		return this.client.post(url, shipping)
			.pipe(map(res => res.body));
	}

	addDeliveryAddress(cartId: string, addressId: string): Observable<Cart> {
		let url = `${environment.API_CART}/Cart/${cartId}/DeliveryAddress/${addressId}`;
		return this.client.post(url)
			.pipe(map(res => res.body));
	}

	addBillingAddress(cartId: string, addressId: string): Observable<Cart> {
		let url = `${environment.API_CART}/Cart/${cartId}/BillingAddress/${addressId}`;
		return this.client.post(url)
			.pipe(map(res => res.body));
	}

	deleteCart(cartId: string): Observable<Cart> {
		let url = `${environment.API_CART}/Cart/${cartId}`;
		return this.client.delete(url);
	}
}