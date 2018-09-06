import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { CartShowCase } from '../../../models/cart-showcase/cart-showcase';
import { Product } from '../../../models/product/product';
import { Store } from "../../../models/store/store";
import { CartShowcaseManager } from '../../../managers/cart-showcase.manager';

declare var $: any;

@Component({
    selector: 'cart-showcase',
    templateUrl: '../../../templates/cart/cart-showcase/cart-showcase.html',
    styleUrls: ['../../../templates/cart/cart-showcase/cart-showcase.scss']
})
export class CartShowCaseComponent implements OnInit, OnDestroy {
    cartShowCase: CartShowCase = new CartShowCase();
    products: Product[] = [];
    @Input() store: Store = new Store();

    constructor(
        private cartShowcaseManager: CartShowcaseManager,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.getShowCases();
        }
    }

    ngOnDestroy() {
        if (isPlatformBrowser(this.platformId)) {
            this.destroyCarousel();
        }
    }

    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId)) {
            this.buildCarousel();
        }
    }

    getShowCases() {
        if (isPlatformBrowser(this.platformId)) {
            this.cartShowcaseManager.getCartShowCase()
                .subscribe(cartShowCase => {
                    this.cartShowCase = cartShowCase;
                    if (this.cartShowCase && this.cartShowCase.products.length > 0) {
                        this.products = cartShowCase.products;
                    }
                });
        }
    }

    private buildCarousel() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.products
                && $('#cartshowcase-items').children('li').length > 0
                && $('#cartshowcase-items').children('.owl-stage-outer').length == 0) {
                $("#cartshowcase-items").owlCarousel({
                    items: 4,
                    margin: 10,
                    loop: false,
                    nav: true,
                    rewind: true,
                    navText: [
                        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
                    ],
                    dots: false,
                    autoplay: true,
                    autoplayTimeout: 5000,
                    autoplayHoverPause: true,
                    responsive: {
                        0: { items: 1 },
                        768: { items: 3 },
                        992: { items: 4 },
                        1200: { items: 4 }
                    }
                });
            }
            else {
                $('.produtos-relacionados ul.showcase-items').show();
            }
        }
    }

    private destroyCarousel() {
        if (isPlatformBrowser(this.platformId)) {
            let $owl = $('#cartshowcase-items');
            $owl.owlCarousel();
            $owl.trigger('destroy.owl.carousel')
        }
    }

    getStore(): Store {
        if (isPlatformBrowser(this.platformId)) {
            return this.store;
        }
    }
}