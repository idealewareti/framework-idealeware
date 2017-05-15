import { Component, Input, OnInit, AfterViewChecked, AfterContentInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';

import { Product } from '../_models/product/product';
import { Sku } from '../_models/product/sku';
import { ProductPicture } from '../_models/product/product-picture';
import { ProductService } from '../_services/product.service';
import { Store } from "../_models/store/store";

//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'up-selling',
    templateUrl: '/views/upselling.component.html',
})
export class ProductUpSellingComponent implements OnInit {

    @Input() references: Object[];
    @Input() store: Store;
    products: Product[] = [];

    constructor(private service: ProductService) { }

    ngOnInit() {
        this.getProducts();
    }

    ngOnDestroy() {
        this.destroyCarousel();
    }

    ngAfterViewChecked() {
        this.buildCarousel();
    }

    private getProducts(): Promise<{}> {
        return new Promise((resolve, reject) => {
            if (this.products.length == 0) {
                this.service.getProducts(this.references)
                    .then(response => {
                        this.products = response;
                        resolve();
                    })
                    .catch(error => reject(error));
            }
        });
    }

    private buildCarousel() {

        if (this.products
            && $('#up-selling-items').children('li').length > 3
            && $('#up-selling-items').children('.owl-stage-outer').length == 0) {
            $("#up-selling-items").owlCarousel({
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
                    0: { items: 2 },
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
        let $owl = $('#up-selling-items');
        $owl.owlCarousel();
        $owl.trigger('destroy.owl.carousel')
    }
}