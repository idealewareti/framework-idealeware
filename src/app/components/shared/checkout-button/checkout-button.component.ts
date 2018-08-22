
import { Component, Input, Inject, PLATFORM_ID, AfterViewChecked } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";

import { Cart } from "../../../models/cart/cart";
import { Store } from "../../../models/store/store";

declare var $: any;

@Component({
    selector: 'checkout-button',
    templateUrl: '../../../templates/shared/checkout-button/checkout-button.html',
    styleUrls: ['../../../templates/shared/checkout-button/checkout-button.scss']
})
export class CheckoutButtonComponent implements AfterViewChecked {

    @Input() icon: boolean = false;
    @Input() text: string = 'Fechar Pedido';
    @Input() cart: Cart;
    @Input() store: Store;


    constructor(
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.cart && this.getNumItemsInCart() == 0) {
                $('.btn-checkout').addClass('disabled');
            }
            else {
                $('.btn-checkout').removeClass('disabled');
            }
        }
    }

    checkout(event) {
        event.preventDefault();
        if (this.store.modality == 1)
            this.router.navigateByUrl('/checkout');
        else if (this.store.modality == 0)
            this.router.navigate(['checkout', 'orcamento']);
    }

    getNumItemsInCart(): number {
        if (this.cart) {
            let numItems = 0;
            numItems += (this.cart.products) ? this.cart.products.length : 0;
            numItems += (this.cart.services) ? this.cart.services.length : 0;
            return numItems;
        }
        else return 0;
    }
}