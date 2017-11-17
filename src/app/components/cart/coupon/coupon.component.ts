import { Component, OnInit, Output, EventEmitter, Input, PLATFORM_ID, Inject } from '@angular/core';
import { Coupon } from "../../../models/coupon/coupon";
import { CouponService } from "../../../services/coupon.service";
import { Cart } from "../../../models/cart/cart";
import { CartManager } from "../../../managers/cart.manager";
import { isPlatformBrowser } from '@angular/common';
import { AppCore } from '../../../app.core';
import { Globals } from '../../../models/globals';

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'app-coupon',
    templateUrl: '../../../template/cart/coupon/coupon.html',
    styleUrls: ['../../../template/cart/coupon/coupon.scss']
})
export class CouponComponent implements OnInit {
    coupon: Coupon = new Coupon();
    @Input() cart: Cart;
    @Output() cartUpdated: EventEmitter<Cart> = new EventEmitter<Cart>();


    constructor(
        private service: CouponService,
        private manager: CartManager,
        private globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() { }

    getDiscountCoupon(event) {
        if (isPlatformBrowser(this.platformId)) {
            event.preventDefault();
            this.service.getCouponDiscount(localStorage.getItem('cart_id'), this.coupon.code)
                .subscribe(cartWithCoupon => {
                    swal('Cupom', 'Cupom adicionado com sucesso.', 'success');

                    localStorage.setItem('shopping_cart', JSON.stringify(cartWithCoupon));
                    this.cart = cartWithCoupon;
                    this.globals.cart = cartWithCoupon;
                    this.cartUpdated.emit(cartWithCoupon);
                }, error => {
                    swal('Erro ao adicionar cupom', error.text(), 'error', 'OK');
                    console.log(error);
                });
        }
    }

    deleteDiscountCoupon(event, couponId: string) {
        if (isPlatformBrowser(this.platformId)) {

            event.preventDefault();
            this.service.deleteCouponDiscount(localStorage.getItem('cart_id'), couponId)
                .subscribe(cart => {
                    swal('Cupom', 'Cupom removido com sucesso.', 'success');

                    localStorage.setItem('shopping_cart', JSON.stringify(cart));
                    this.cart = cart;
                    this.cartUpdated.emit(cart);
                }, error => {
                    let msg = error.text();

                    if (error.status == 500) {
                        msg = "Erro ao excluir cupom."
                    }
                    swal('Erro ao excluir cupom', msg, 'error');
                    console.log(error);
                });
        }
    }

    public isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }
}