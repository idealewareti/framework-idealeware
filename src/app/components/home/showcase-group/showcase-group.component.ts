import {
    Component, OnInit, SimpleChanges, OnChanges,
    ChangeDetectionStrategy, ChangeDetectorRef, AfterViewChecked, OnDestroy
} from '@angular/core';
import { PLATFORM_ID, Inject, Input } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Store } from '../../../models/store/store';
import { ShowcaseGroup } from '../../../models/showcase/showcase-group';
import { Product } from '../../../models/product/product';
import { ShowCaseService } from '../../../services/showcase.service';
import { makeStateKey, TransferState } from '@angular/platform-browser';

declare var $: any;

@Component({
    selector: 'app-showcase-group',
    templateUrl: '../../../template/home/showcase-group/showcase-group.html',
    styleUrls: ['../../../template/home/showcase-group/showcase-group.scss']
})
export class ShowcaseGroupComponent implements OnChanges, AfterViewChecked {
    @Input() group: ShowcaseGroup;
    @Input() store: Store;

    products: Product[];

    constructor(
        private showcaseService: ShowCaseService,
        private changeRef: ChangeDetectorRef,
        private state: TransferState,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['group'] || changes['store']) {
            if (!this.group || !this.store) {
                return;
            }
            this.fetchProducts(this.group.id);
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
        if (this.products && this.products.length > 0) {
            return true;
        }
        return false;
    }

    private fetchProducts(id: string): void {
        this.showcaseService.getGroupProducts(id).subscribe(
            products => this.products = products
        );
    }
}