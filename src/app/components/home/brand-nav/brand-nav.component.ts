import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { PLATFORM_ID, Inject, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '../../../models/store/store';
import { Brand } from '../../../models/brand/brand';
import { AppCore } from '../../../app.core';
import { BrandManager } from '../../../managers/brand.manager';

declare var $: any;

@Component({
    selector: 'brand-nav',
    templateUrl: '../../../templates/home/brand-nav/brand-nav.html',
    styleUrls: ['../../../templates/home/brand-nav/brand-nav.scss']
})
export class BrandNavComponent implements OnInit, AfterViewChecked {
    @Input() store: Store;
    brands: Brand[] = [];

    constructor(
        private manager: BrandManager,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    ngOnInit() {
        this.manager.getAll()
            .subscribe(brands => {
                this.brands = brands;
            },error => {
                throw new Error(`${error.error} Status: ${error.status}`);
            });
    }

    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.brands.length > 0 && $('.showcase-brands.slick-slider .slick-track').children('.slick-slide').length == 0) {
                $('.showcase-brands').slick({
                    infinite: true,
                    autoplay: true,
                    slidesToShow: 5,
                    slidesToScroll: 5
                });
            }
        }
    }

    getRoute(brand: Brand): string {
        return `/marcas/${AppCore.getNiceName(brand.name)}-${brand.id}`;
    }

    getPictureUrl(brand: Brand): string {
        return `${this.store.link}/static/brands/${brand.picture}`;
    }

    getBrands() {
        if (!isPlatformBrowser(this.platformId)) {
            return this.brands.slice(0, 5);
        }
        return this.brands;
    }
}