import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Coupon } from "../models/coupon/coupon";
import { Cart } from "../models/cart/cart";
import { CouponService } from "../services/coupon.service";

@Injectable({
    providedIn: 'root'
})
export class CouponManager {

    constructor(private service: CouponService) {}
    
    public getCouponsFromCustomer(customerId: string): Observable<Coupon[]> {
        return this.service.getCouponsFromCustomer(customerId);

    }

    public getCouponDiscount(id: string, code: string): Observable<Cart> {
        return this.service.getCouponDiscount(id, code);
    }

    public deleteCouponDiscount(cartId: string, couponId: string): Observable<Cart> {
        return this.service.deleteCouponDiscount(cartId, couponId);
    }
}