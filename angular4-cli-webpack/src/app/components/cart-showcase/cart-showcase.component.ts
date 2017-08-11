import { Component, OnInit, OnDestroy } from '@angular/core';
import {CartService} from 'app/services/cart.service';
import {ProductService} from 'app/services/product.service';
import {CartShowCase} from 'app/models/cart-showcase/cart-showcase';
import {Product} from 'app/models/product/product';
import { Store } from "app/models/store/store";
import { Globals } from "app/models/globals";

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'cart-showcase',
    templateUrl: '../../views/cart-showcase.component.html',
})
export class CartShowCaseComponent implements OnInit, OnDestroy {
    cartShowCase: CartShowCase = new CartShowCase();
    products: Product[] = [];
    store: Store = new Store();

    constructor(
        private service: CartService,
        private productService: ProductService,
        private globals: Globals
    ) { }

    ngOnInit() {
        this.getShowCases();
     }

    ngOnDestroy() {
        this.destroyCarousel();
    }

    ngAfterViewChecked() {
        this.buildCarousel();
    }

    getShowCases(){
        this.service.getCartShowCase()
        .then(response => {
            this.cartShowCase = response;
            this.getProducts();
        })
        .catch(error => console.log(error));
    }

    getProducts(){
        if(this.cartShowCase.products.length > 0){
            let references =  this.cartShowCase.products;
            this.productService.getProducts(references)
                .then(response => this.products = response)
                .catch(error => console.log(error));
        }
    }

    private buildCarousel() {

        if (this.products
            && $('#cartshowcase-items').children('li').length > 3
            && $('#cartshowcase-items').children('.owl-stage-outer').length == 0) {
            $("#cartshowcase-items").owlCarousel({
                items: 4,
                margin: 10,
                loop: true,
                nav: true,
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

    private destroyCarousel() {
        let $owl = $('#cartshowcase-items');
        $owl.owlCarousel();
        $owl.trigger('destroy.owl.carousel')
    }

    getStore(): Store{
        return this.globals.store;
    }
}