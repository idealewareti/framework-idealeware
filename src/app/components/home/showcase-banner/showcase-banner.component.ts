import { Component, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject, Input } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ShowCaseBanner } from '../../../models/showcase/showcase-banner';
import { Store } from '../../../models/store/store';

declare var $: any;

@Component({
    selector: 'app-showcase-banner',
    templateUrl: '../../../template/home/showcase-banner/showcase-banner.html',
    styleUrls: ['../../../template/home/showcase-banner/showcase-banner.scss']
})
export class ShowcaseBannerComponent implements OnInit {
    @Input() banners: ShowCaseBanner[];
    @Input() store: Store = new Store();

    constructor( @Inject(PLATFORM_ID) private platformId: Object) { }

    ngOnInit() { }

    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.banners.length > 0 && $('.showcase-banners.slick-slider .slick-track').children('.slick-slide').length == 0) {
                $('.showcase-banners').slick({
                    dots: true,
                    autoplay: true,
                    infinite: true,
                    arrows: false,
                });
            }
        }
    }

    getBannerUrl(banner: ShowCaseBanner): string {
        return `${this.store.link}/static/showcases/${banner.fullBanner}`;
    }
}