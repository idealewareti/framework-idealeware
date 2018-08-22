import { Component, Input } from '@angular/core';
import { ShowCaseBanner } from '../../../models/showcase/showcase-banner';
import { Store } from '../../../models/store/store';

@Component({
    selector: 'showcase-banner-stripe',
    templateUrl: '../../../templates/home/showcase-banner-stripe/showcase-banner-stripe.html',
    styleUrls: ['../../../templates/home/showcase-banner-stripe/showcase-banner-stripe.scss']
})
export class ShowcaseBannerStripeComponent {
    @Input() banners: ShowCaseBanner[];
    @Input() store: Store;

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