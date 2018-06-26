import { Product } from "../../../models/product/product";
import { Component, PLATFORM_ID, Inject, Input, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';
import { CarouselService } from '../../../services/carousel.service';
import { ShowcaseGroup } from "../../../models/showcase/showcase-group";
import { Store } from "../../../models/store/store";
import { isPlatformBrowser } from '@angular/common';

declare var $: any;

@Component({
    selector: 'app-showcase-group-product',
    templateUrl: '../../../template/home/showcase-group-product/showcase-group-product.component.html'
})
export class ShowcaseGroupProductComponent implements AfterViewChecked, OnChanges {
    @Input() group: ShowcaseGroup;
    @Input() store: Store;
    products: Product[];

    carouselService: CarouselService;
    constructor(
        carouselservice: CarouselService,
        @Inject(PLATFORM_ID) private platformId: Object) {
        this.carouselService = carouselservice;
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (changes['group'] || changes['store']) {
            if (!this.group || !this.store) {
                return;
            }
            if (this.group) {
                this.carouselService.getCarouselProducts(this.group.id)
                    .subscribe(group => {
                        this.products = group.products;
                    }, error => console.log(`Problemas de conexão ao buscar produtos por grupo. : ${error}`));
            } else {
                console.log("Produtos não pode ser carregado por que os grupos não foram carregados.")
            }
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
}