import { Component, OnInit, Input } from '@angular/core';
import { Cart } from '../../../models/cart/cart';
import { Router } from '@angular/router';
import $ from 'jquery/dist/jquery';

@Component({
    selector: 'app-checkout-button',
    templateUrl: '../../../template/shared/checkout-button/checkout-button.html',
    styleUrls: ['../../../template/shared/checkout-button/checkout-button.scss']
})
export class CheckoutButtonComponent implements OnInit {
    @Input() icon: boolean = false;
    @Input() text: string = 'Fechar Pedido';
    @Input() cart: Cart;

    constructor(private parentRouter: Router){}

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