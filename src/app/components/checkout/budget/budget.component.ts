import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';

import { Cart } from "../../../models/cart/cart";
import { Customer } from "../../../models/customer/customer";
import { CartManager } from "../../../managers/cart.manager";
import { Sku } from "../../../models/product/sku";
import { Store } from '../../../models/store/store';
import { BudgetManager } from '../../../managers/budget.manager';

declare var swal: any;
declare var $: any;

@Component({
    selector: 'budget',
    templateUrl: '../../../templates/checkout/budget/budget.html',
    styleUrls: ['../../../templates/checkout/budget/budget.scss']
})
export class BudgetComponent implements OnInit {
    cart: Cart;
    customer: Customer;
    private store: Store;
    mediaPath: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private cartManager: CartManager,
        private budgetManager: BudgetManager,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    ngOnInit() {
        this.getStore();
        this.getCustomer();
        this.getCart();
    }

    private getCart() {
        this.cart = this.activatedRoute.snapshot.data.cart;
    }

    private getStore() {
        this.store = this.activatedRoute.snapshot.data.store;
        this.mediaPath = `${this.store.link}/static/products/`;
    }

    private getCustomer() {
        this.customer = this.activatedRoute.snapshot.data.customer;
        this.cartManager.setCustomerToCart()
            .subscribe(cart => {
                this.cart = cart;
            });
    }

    placeOrder(event) {
        event.preventDefault();
        $('.btn-checkout').button('loading');
        this.budgetManager.createBudget()
            .subscribe(budget => {
                this.cartManager.removeCart();
                this.router.navigate(['checkout', 'orcamento', 'concluido', budget.numberBudget])
            }, err => {
                $('.btn-checkout').button('reset');
                swal({
                    title: 'Erro ao criar o orçamento',
                    text: err.error,
                    type: 'error',
                    confirmButtonText: 'OK'
                });
            });
    }

    isCartEmpty(cart: Cart): boolean {
        let empty = true;

        if (cart.products && this.cart.products.length == 0)
            empty = false;
            
        return empty;
    }


    hasPicture(sku: Sku): boolean {
        if (sku.picture['thumbnail'])
            return true;
        else return false;
    }
}
