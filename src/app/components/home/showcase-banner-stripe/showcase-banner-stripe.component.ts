import { Component, OnInit, Input } from '@angular/core';
import { ShowCaseBanner } from '../../../models/showcase/showcase-banner';
import { Globals } from '../../../models/globals';
import { Store } from '../../../models/store/store';

@Component({
    selector: 'app-showcase-banner-stripe',
    templateUrl: '../../../template/home/showcase-banner-stripe/showcase-banner-stripe.html',
    styleUrls: ['../../../template/home/showcase-banner-stripe/showcase-banner-stripe.scss']
})
export class ShowcaseBannerStripeComponent implements OnInit {
    @Input() banners: ShowCaseBanner[];
    @Input() store: Store = new Store();

    constructor(private globals: Globals) { }

    ngOnInit() { }

    calcWidthMedium(): number {
        let total: number = this.banners.length
        if (total > 1 && total <= 4) {
            return 12 / total;
        }
        return 12;
    }

    getBannerUrl(banner: ShowCaseBanner): string {
        return `${this.store.link}/static/showcases/${banner.fullBanner}`;
    }
}