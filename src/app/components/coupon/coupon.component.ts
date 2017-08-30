import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Coupon } from "app/models/coupon/coupon";
import { CouponService } from "app/services/coupon.service";
import { Cart } from "app/models/cart/cart";
import { CartManager } from "app/managers/cart.manager";

import { AppSettings } from "app/app.settings";
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'coupon',
    templateUrl: '../../views/coupon.component.html'
    // styleUrls: ['../../styles/coupon.component.css']
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
                    text: error.text(),
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
                 let msg = error.text();
                 
                 if(error.status == 500){
                    msg = "Erro ao excluir cupom."
                }
                swal({
                    title: 'Erro ao excluir cupom',
                    text: msg,
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