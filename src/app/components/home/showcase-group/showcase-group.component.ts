import { Component, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject, Input } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Store } from '../../../models/store/store';
import { ShowcaseGroup } from '../../../models/showcase/showcase-group';
import { ProductService } from '../../../services/product.service';

declare var $: any;

@Component({
    selector: 'app-showcase-group',
    templateUrl: '../../../template/home/showcase-group/showcase-group.html',
    styleUrls: ['../../../template/home/showcase-group/showcase-group.scss']
})
export class ShowcaseGroupComponent implements OnInit {
    @Input() group: ShowcaseGroup;
    @Input() store: Store;

    constructor(
        private productService: ProductService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {}

    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.group.products
                && this.group.products.length > 0
                && $(`#group-${this.group.id}`).children('li').length > 1
                && $(`#group-${this.group.id}`).children('.owl-stage-outer').length == 0
            ) {
                $(`#group-${this.group.id}`).owlCarousel({
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

    hasProducts(): boolean {
        if (this.group.products && this.group.products.length > 0) {
            return true;
        }
        return false;
    }
}