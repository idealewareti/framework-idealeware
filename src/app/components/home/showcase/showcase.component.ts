import { Component, OnInit } from '@angular/core';
import { ShowCaseBanner } from '../../../models/showcase/showcase-banner';
import { ShowCase } from '../../../models/showcase/showcase';
import { EnumBannerType } from '../../../enums/banner-type.enum';
import { Store } from '../../../models/store/store';
import { ShowCaseManager } from '../../../managers/showcase.manager';
import { StoreManager } from '../../../managers/store.manager';
import { SeoManager } from '../../../managers/seo.manager';

@Component({
    selector: 'showcase',
    templateUrl: '../../../templates/home/showcase/showcase.html',
    styleUrls: ['../../../templates/home/showcase/showcase.scss']
})
export class ShowcaseComponent implements OnInit {
    banners: ShowCaseBanner[] = [];
    stripeBanners: ShowCaseBanner[] = [];
    halfBanners: ShowCaseBanner[] = [];
    store: Store;

    constructor(
        private storeManager: StoreManager,
        private showCasemanager: ShowCaseManager,
        private seoManager: SeoManager
    ) { }

    ngOnInit() {
        this.storeManager.getStore()
            .subscribe(result => {
                this.store = result;
                this.showCasemanager.getBannersFromStore()
                    .subscribe(showcase => {
                        this.initData(showcase);
                    });
            })
    }

    private initData(data: ShowCase): void {
        this.banners = data.banners.filter(b => b.bannerType == EnumBannerType.Full);
        this.stripeBanners = data.banners.filter(b => b.bannerType == EnumBannerType.Tarja);
        this.halfBanners = data.banners.filter(b => b.bannerType == EnumBannerType.Half);

        this.seoManager.setTags({
            title: data.metaTagTitle,
            description: data.metaTagDescription,
            image: `${this.store.link}/static/store/${this.store.logo}`
        });
    }
}