import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpClient} from '../helpers/httpclient'
import {Title} from '@angular/platform-browser';
import {AppSettings} from 'app/app.settings';
import {NgProgressService} from 'ngx-progressbar';
import { Token } from '../models/customer/token';
import { Coupon } from "../models/coupon/coupon";
import { Cart } from "../models/cart/cart";

@Injectable()
export class CouponService{
    private token: Token;

    constructor(
        private titleService: Title,
        private client: HttpClient,
        private loaderService: NgProgressService

    ){}

    private getToken(){
        this.token = new Token();
        this.token.accessToken = localStorage.getItem('auth');
        this.token.createdDate = new Date(localStorage.getItem('auth_create'));
        this.token.expiresIn = Number(localStorage.getItem('auth_expires'));
        this.token.tokenType = 'Bearer';
    }

    public getCouponsFromCustomer(customerId: string): Promise<Coupon[]>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_COUPON}/coupons/${customerId}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let coupons = response.map(c => c = new Coupon(c));
                resolve(coupons);
            }, error => reject(error));
        });
    }

    public getCouponDiscount(id: string, code: string): Promise<Cart>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_COUPON}/coupons/${id}/coupon/${code}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let coupons  = new Coupon(response);
                resolve(coupons);
            }, error => reject(error));
        });
    }

    public deleteCouponDiscount(cartId: string, couponId: string): Promise<Cart>{
        return new Promise((resolve, reject) => {
              let url = `${AppSettings.API_COUPON}/coupons/${cartId}/coupon/${couponId}`;
            this.client.delete(url)
            .map(res => res.json())
            .subscribe(response => {
                let coupons  = new Coupon(response);
                resolve(coupons);
            }, error => reject(error));
        });
    }
}