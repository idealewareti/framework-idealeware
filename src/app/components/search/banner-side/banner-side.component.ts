import { Component, OnChanges, Input, SimpleChange, Inject, PLATFORM_ID } from "@angular/core";
import { Banner } from "../../../models/banner/banner";
import { BannerService } from "../../../services/banner.service";
import { Globals } from "../../../models/globals";
import { isPlatformBrowser } from "@angular/common";
import { AppCore } from "../../../app.core";
import { Store } from "../../../models/store/store";

@Component({
    moduleId: module.id,
    selector: 'app-banner-side',
    templateUrl: '../../../template/search/banner-side/banner-side.html',
    styleUrls: ['../../../template/search/banner-side/banner-side.scss']
})
export class BannerSideComponent implements OnChanges {
    @Input() module: string = null;
    @Input() moduleId: string = null;
    @Input() place: number;
    @Input() store: Store;
    bannersSide: Banner[] = [];

    mediaPath: string;

    constructor(
        private service: BannerService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
    }
    
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        this.mediaPath = `${this.store.link}/static/banners/`;
        if (changes['moduleId'].currentValue != changes['moduleId'].previousValue) {
            switch (this.module) {
                case 'category':
                    this.service.getBannersFromCategory(this.moduleId, this.place)
                        .subscribe(banners => this.bannersSide = banners, error => console.log(error));
                    break;

                case 'brand':
                    this.service.getBannersFromBrand(this.moduleId, this.place)
                        .subscribe(banners => this.bannersSide = banners, error => console.log(error));
                    break;

                case 'group':
                    this.service.getBannersFromGroup(this.moduleId, this.place)
                        .subscribe(banners => this.bannersSide = banners, error => console.log(error));
                    break;

                default:
                    this.service.getBannersFromCategory(this.moduleId, this.place)
                        .subscribe(banners => this.bannersSide = banners, error => console.log(error));
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