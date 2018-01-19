import { Component, Input, OnInit, AfterViewChecked, AfterContentInit, OnDestroy, OnChanges, SimpleChanges, PLATFORM_ID, Inject } from '@angular/core';
import { Product } from '../../../models/product/product';
import { Sku } from '../../../models/product/sku';
import { ProductPicture } from '../../../models/product/product-picture';
import { ProductService } from '../../../services/product.service';
import { Store } from "../../../models/store/store";
import { isPlatformBrowser } from '@angular/common';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app-cross-selling',
    templateUrl: '../../../template/product/product-cross-selling/product-cross-selling.html',
    styleUrls: ['../../../template/product/product-cross-selling/product-cross-selling.scss']
})
export class ProductCrossSellingComponent implements OnChanges {

    @Input() products: Product[];
    @Input() store: Store;

    constructor(
        private service: ProductService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnDestroy() {
        this.destroyCarousel();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['products'].firstChange)
            this.destroyCarousel();
    }

    ngAfterViewChecked() {
        this.buildCarousel();
    }

    private buildCarousel() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.products
                && this.products.length > 3
                && $('#cross-selling-items').children('li').length > 3
                && $('#cross-selling-items').children('.owl-stage-outer').length == 0) {

                $("#cross-selling-items").owlCarousel({
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
        }
    }

    private destroyCarousel() {
        if (isPlatformBrowser(this.platformId)) {
            let $owl = $('#cross-selling-items');
            $owl.owlCarousel();
            $owl.trigger('destroy.owl.carousel')
        }
    }
}