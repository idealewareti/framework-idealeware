import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Coupon } from "../_models/coupon/coupon";
import { CouponService } from "../_services/coupon.service";
import { Cart } from "../_models/cart/cart";
import { CartManager } from "../_managers/cart.manager";

import { AppSettings } from "../app.settings";
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'coupon',
    templateUrl: '/views/coupon.component.html'
    // styleUrls: ['/styles/coupon.component.css']
})
export class CouponComponent implements OnInit {
    coupon: Coupon = new Coupon();
    @Input() cart: Cart;
    @Output() cartUpdated: EventEmitter<Cart> = new EventEmitter<Cart>();


    constructor(private service: CouponService, private manager: CartManager) { }

    ngOnInit() { }

    getDiscountCoupon(event) {
        event.preventDefault();
        this.service.getCouponDiscount(this.manager.getCartId(), this.coupon.code)
            .then(cartWithCoupon => {
                swal({
                    title: 'Cupom',
                    text: 'Cupom adicionado com sucesso.',
                    type: 'success',
                    confirmButtonText: 'OK'
                });

                localStorage.setItem('shopping_cart', JSON.stringify(cartWithCoupon));
                this.cart = cartWithCoupon;
                this.cartUpdated.emit(cartWithCoupon);
            })
            .catch(error => {
                swal({
                    title: 'Erro ao adicionar cupom',
                    text: error._body,
                    type: 'error',
                    confirmButtonText: 'OK'
                });
                console.log(error);
            });
    }

    deleteDiscountCoupon(event, couponId: string) {
        event.preventDefault();
        this.service.deleteCouponDiscount(this.manager.getCartId(), couponId)
            .then(cart => {
                swal({
                    title: 'Cupom',
                    text: 'Cupom removido com sucesso.',
                    type: 'success',
                    confirmButtonText: 'OK'
                });

                localStorage.setItem('shopping_cart', JSON.stringify(cart));
                this.cart = cart;
                this.cartUpdated.emit(cart);
            })
            .catch(error => {
                 if(error._body.status == 500)
                {
                    error._body = "Erro ao excluir cupom."
                }
                swal({
                    title: 'Erro ao excluir cupom',
                    text: error._body,
                    type: 'error',
                    confirmButtonText: 'OK'
                });
                console.log(error);
            });
    }

    public isMobile(): boolean {
        return AppSettings.isMobile();
    }
}