import {Component, Input, AfterViewChecked, OnInit} from '@angular/core';
import {AppSettings} from 'app/app.settings';
import {Cart} from 'app/models/cart/cart';
import {CartItem} from 'app/models/cart/cart-item';
import { CartManager } from 'app/managers/cart.manager';
import { Router } from "@angular/router";

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'checkout-button',
    templateUrl: '../../views/checkout-button.component.html'
})
export class CheckoutButtonComponent {
    @Input() icon: boolean = false;
    @Input() text: string = 'Fechar Pedido';
    @Input() cart: Cart;

    constructor(private manager: CartManager, private parentRouter: Router){}

    ngOnInit(){}

    ngAfterViewChecked(){
        if(this.cart && this.getNumItemsInCart() == 0)
            $('.btn-checkout').addClass('disabled');
        else
            $('.btn-checkout').removeClass('disabled');
    }

    checkout(event){
        event.preventDefault();

        if(localStorage.getItem('auth')){
            this.parentRouter.navigateByUrl('/checkout');
        }
        else{
            this.parentRouter.navigateByUrl('/login;step=checkout');
        }
    }

    getNumItemsInCart(): number {
        if(this.cart){
            let numItems = 0;
            numItems += (this.cart.products) ? this.cart.products.length : 0;
            numItems += (this.cart.services) ? this.cart.services.length : 0;
            numItems += (this.cart.paints) ? this.cart.paints.length : 0;
            
            return  numItems;
        }
        else return 0;

    }
}