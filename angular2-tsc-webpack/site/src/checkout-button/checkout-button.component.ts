import {Component, Input, AfterViewChecked, OnInit} from '@angular/core';
import {AppSettings} from '../app.settings';
import {Cart} from '../_models/cart/cart';
import {CartItem} from '../_models/cart/cart-item';
import { CartManager } from '../_managers/cart.manager';
import { Router } from "@angular/router";

//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'checkout-button',
    templateUrl: '/views/checkout-button.component.html'
})
export class CheckoutButtonComponent {
    @Input() icon: boolean = false;
    @Input() text: string = 'Fechar Pedido';
    @Input() cart: Cart;

    constructor(private manager: CartManager, private parentRouter: Router){}

    ngOnInit(){}

    ngAfterViewChecked(){
        if(this.cart.products.length == 0)
            $('.btn-checkout').addClass('disabled');
        else
            $('.btn-checkout').removeClass('disabled');
    }
}