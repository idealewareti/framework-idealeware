import { Component, OnInit, Input } from '@angular/core';
import { ShowCaseBanner } from '../../../models/showcase/showcase-banner';
import { Store } from '../../../models/store/store';

@Component({
    selector: 'app-showcase-banner-half',
    templateUrl: '../../../template/home/showcase-banner-half/showcase-banner-half.html',
    styleUrls: ['../../../template/home/showcase-banner-half/showcase-banner-half.scss']
})
export class ShowcaseBannerHalfComponent implements OnInit {
    @Input() banners: ShowCaseBanner[];
    @Input() store: Store = new Store();

    constructor() { }

    ngOnInit() { }

    getBannerUrl(banner: ShowCaseBanner): string {
        return `${this.store.link}/static/showcases/${banner.fullBanner}`;
    }
}