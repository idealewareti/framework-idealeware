import { Component, Input } from '@angular/core';
import { ShowCaseBanner } from '../../../models/showcase/showcase-banner';
import { Store } from '../../../models/store/store';

@Component({
    selector: 'showcase-banner-half',
    templateUrl: '../../../templates/home/showcase-banner-half/showcase-banner-half.html',
    styleUrls: ['../../../templates/home/showcase-banner-half/showcase-banner-half.scss']
})
export class ShowcaseBannerHalfComponent {
    @Input() banners: ShowCaseBanner[];
    @Input() store: Store;

    getBannerUrl(banner: ShowCaseBanner): string {
        return `${this.store.link}/static/showcases/${banner.fullBanner}`;
    }
}