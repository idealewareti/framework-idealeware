import { Injectable } from '@angular/core';
import { Token } from '../models/customer/token';
import { Order } from '../models/order/order';
import { Cart } from "../models/cart/cart";
import { HttpClientHelper } from '../helpers/http.helper';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OrderService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getOrder(id: string, token: Token): Observable<Order> {
        let url = `${environment.API_ORDER}/order/${id}`;
        return this.client.get(url, token)
            .map(res => res.json());
    }

    getOrders(token: Token): Observable<Order[]> {
        let url = `${environment.API_ORDER}/order/customer`
        return this.client.get(url, token)
            .map(res => res.json());
    }

    placeOrder(cartId: string, token: Token): Observable<Order> {
        let url = `${environment.API_ORDER}/Order/${cartId}`;
        return this.client.post(url, null, token)
            .map(res => res.json());
    }

    validateOrder(cartId: string, token: Token): Observable<Cart> {
        let url = `${environment.API_ORDERVALIDATION}/OrderValidation/${cartId}`;
        return this.client.post(url, null, token)
            .map(res => res.json());
    }
}