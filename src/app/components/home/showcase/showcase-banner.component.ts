import { Component, AfterViewChecked } from '@angular/core';
import { PLATFORM_ID, Inject, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ShowCaseBanner } from '../../../models/showcase/showcase-banner';
import { Store } from '../../../models/store/store';

declare var $: any;

@Component({
    selector: 'showcase-banner',
    templateUrl: '../../../templates/home/showcase-banner/showcase-banner.html',
    styleUrls: ['../../../templates/home/showcase-banner/showcase-banner.scss']
})
export class ShowcaseBannerComponent implements AfterViewChecked {
    @Input() banners: ShowCaseBanner[];
    @Input() store: Store;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

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