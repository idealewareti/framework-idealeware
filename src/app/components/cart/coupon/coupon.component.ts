import { Component, OnInit, Output, EventEmitter, Input, PLATFORM_ID, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

import { Coupon } from "../../../models/coupon/coupon";
import { Cart } from "../../../models/cart/cart";
import { AppCore } from '../../../app.core';
import { CouponManager } from '../../../managers/coupon.manager';
import { CartManager } from '../../../managers/cart.manager';

declare var swal: any;

@Component({
    selector: 'coupon',
    templateUrl: '../../../templates/cart/coupon/coupon.html',
    styleUrls: ['../../../templates/cart/coupon/coupon.scss']
})
export class CouponComponent implements OnInit {
    coupon: Coupon = new Coupon();
    formCoupon: FormGroup;
    @Input() cart: Cart;
    @Output() cartUpdated: EventEmitter<Cart> = new EventEmitter<Cart>();

    constructor(
        private formBuilder: FormBuilder,
        private couponManager: CouponManager,
        private cartManager: CartManager,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.formCoupon = this.formBuilder.group({
                code: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(1)
                    ]
                ]
            });
        }
    }

    applyDiscount() {
        if (isPlatformBrowser(this.platformId)) {
            const code = this.formCoupon.get('code').value;
            this.couponManager.getCouponDiscount(this.cartManager.getCartId(), code)
                .subscribe(cart => {
                    swal('Cupom', 'Cupom adicionado com sucesso.', 'success');
                    this.cartManager.updateCartFromEmitter(cart);
                    this.formCoupon.reset();
                    this.cartUpdated.emit(cart);
                }, err => {
                    swal('Problemas ao adicionar cupom.', err.error, 'error', 'OK');
                })
        }
    }

    removeDiscount(couponId: string) {
        if (isPlatformBrowser(this.platformId)) {
            this.couponManager.deleteCouponDiscount(this.cartManager.getCartId(), couponId)
                .subscribe(cart => {
                    swal('Cupom', 'Cupom removido com sucesso.', 'success');
                    this.cartManager.updateCartFromEmitter(cart);
                    this.cartUpdated.emit(cart);
                }, err => {
                    swal('Problemas ao remover cupom', err.error, 'error', 'OK');
                })
        }
    }

    public isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }
}