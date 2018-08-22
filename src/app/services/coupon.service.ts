import { Injectable } from '@angular/core';
import { Coupon } from "../models/coupon/coupon";
import { Cart } from "../models/cart/cart";
import { HttpClientHelper } from '../helpers/http.helper';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CouponService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }
    public getCouponsFromCustomer(customerId: string): Observable<Coupon[]> {
        let url = `${environment.API_COUPON}/coupons/${customerId}`;
        return this.client.get(url);

    }

    public getCouponDiscount(id: string, code: string): Observable<Cart> {
        let url = `${environment.API_COUPON}/coupons/${id}/coupon/${code}`;
        return this.client.get(encodeURI(url));
    }

    public deleteCouponDiscount(cartId: string, couponId: string): Observable<Cart> {
        let url = `${environment.API_COUPON}/coupons/${cartId}/coupon/${couponId}`;
        return this.client.delete(url);
    }
}