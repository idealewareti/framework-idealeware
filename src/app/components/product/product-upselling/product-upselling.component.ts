import { Component, Input, OnInit, AfterViewChecked, AfterContentInit, OnDestroy, OnChanges, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { Product } from '../../../models/product/product';
import { Sku } from '../../../models/product/sku';
import { ProductPicture } from '../../../models/product/product-picture';
import { ProductService } from '../../../services/product.service';
import { Store } from "../../../models/store/store";
import { isPlatformBrowser } from '@angular/common';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app-up-selling',
    templateUrl: '../../../template/product/product-upselling/product-upselling.html',
    styleUrls: ['../../../template/product/product-upselling/product-upselling.scss']
})
export class ProductUpSellingComponent implements OnChanges {

    @Input() products: Product[];
    @Input() store: Store;

    constructor(
        private service: ProductService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['products'].firstChange)
            this.destroyCarousel();
    }

    ngOnDestroy() {
        this.destroyCarousel();
    }

    ngAfterViewChecked() {
        this.buildCarousel();
    }

    private buildCarousel() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.products
                && this.products.length > 3
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
                        0: { items: 1 },
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
            let $owl = $('#up-selling-items');
            $owl.owlCarousel();
            $owl.trigger('destroy.owl.carousel')
        }
    }
}