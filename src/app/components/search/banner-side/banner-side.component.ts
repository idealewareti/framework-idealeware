import { Component, OnChanges, Input, SimpleChange, Inject, PLATFORM_ID } from "@angular/core";
import { Banner } from "../../../models/banner/banner";
import { isPlatformBrowser } from "@angular/common";
import { AppCore } from "../../../app.core";
import { BannerManager } from "../../../managers/banner.manager";
import { Store } from "../../../models/store/store";

@Component({
    selector: 'banner-side',
    templateUrl: '../../../templates/search/banner-side/banner-side.html',
    styleUrls: ['../../../templates/search/banner-side/banner-side.scss']
})
export class BannerSideComponent implements OnChanges {
    @Input() module: string = null;
    @Input() moduleId: string = null;
    @Input() place: number;
    @Input() store: Store;
    mediaPath: string;
    bannersSide: Banner[] = [];

    constructor(
        private bannerManager: BannerManager,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        this.mediaPath = `${this.store.link}/static/banners/`;

        if (changes['moduleId']) {
            switch (this.module) {
                case 'category':
                    this.bannerManager.getBannersFromCategory(this.moduleId, this.place)
                        .subscribe(banners => this.bannersSide = banners);
                    break;

                case 'brand':
                    this.bannerManager.getBannersFromBrand(this.moduleId, this.place)
                        .subscribe(banners => this.bannersSide = banners);
                    break;

                case 'group':
                    this.bannerManager.getBannersFromGroup(this.moduleId, this.place)
                        .subscribe(banners => this.bannersSide = banners);
                    break;

                default:
                    this.bannerManager.getBannersFromCategory(this.moduleId, this.place)
                        .subscribe(banners => this.bannersSide = banners);
                    break;
            }
        }
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }
}