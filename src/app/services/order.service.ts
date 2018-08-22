import { Injectable } from '@angular/core';
import { Order } from '../models/order/order';
import { Cart } from "../models/cart/cart";
import { HttpClientHelper } from '../helpers/http.helper';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    getOrder(id: string): Observable<Order> {
        let url = `${environment.API_ORDER}/order/${id}`;
        return this.client.get(url);
    }

    getOrders(): Observable<Order[]> {
        let url = `${environment.API_ORDER}/order/customer`
        return this.client.get(url);
    }

    placeOrder(cartId: string): Observable<Order> {
        let url = `${environment.API_ORDER}/Order/${cartId}`;
        return this.client.post(url, null)
            .pipe(map(res => res.body));
    }

    validateOrder(cartId: string): Observable<Cart> {
        let url = `${environment.API_ORDERVALIDATION}/OrderValidation/${cartId}`;
        return this.client.post(url, null)
            .pipe(map(res => res.body));
    }
}