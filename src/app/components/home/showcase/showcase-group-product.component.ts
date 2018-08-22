import { Product } from "../../../models/product/product";
import { Component, PLATFORM_ID, Inject, Input, AfterViewChecked, OnInit } from '@angular/core';
import { ShowcaseGroup } from "../../../models/showcase/showcase-group";
import { Store } from "../../../models/store/store";
import { isPlatformBrowser } from '@angular/common';
import { CarouselManager } from "../../../managers/carousel.manager";

declare var $: any;

@Component({
    selector: 'showcase-group-product',
    templateUrl: '../../../templates/home/showcase-group-product/showcase-group-product.html'
})
export class ShowcaseGroupProductComponent implements OnInit, AfterViewChecked {

    @Input() group: ShowcaseGroup;
    @Input() store: Store;
    products: Product[];

    constructor(
        private carouselManager: CarouselManager,
        @Inject(PLATFORM_ID) private platformId: Object) { }

    ngOnInit(): void {
        if (this.group) {
            this.carouselManager.getCarouselProducts(this.group.id)
                .subscribe(group => {
                    this.products = group.products;
                });
        }
    }

    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId)) {
            const selector = $(`#group-${this.group.id}`);
            if (this.products
                && this.products.length > 0
                && selector.children('li').length > 1
                && selector.children('.owl-stage-outer').length == 0
            ) {
                selector.owlCarousel({
                    items: this.products.length > 4 ? 4 : this.products.length,
                    margin: 10,
                    loop: false,
                    nav: true,
                    navText: [
                        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
                    ],
                    rewind: true,
                    dots: false,
                    autoplay: true,
                    navElement: 'div',
                    autoplayTimeout: 5000,
                    autoplayHoverPause: true,
                    responsive: {
                        0: { items: 1 },
                        768: { items: this.products.length > 4 ? 3 : this.products.length - 1 },
                        992: { items: this.products.length > 4 ? 4 : this.products.length },
                        1200: { items: this.products.length > 4 ? 4 : this.products.length }
                    }
                });
            }
        }
    }

    trackById(index, item) {
        return item.id;
    }
}