import { Component, OnChanges, Input, SimpleChange } from "@angular/core";
import { Banner } from "../_models/banner/banner";
import { AppSettings } from "../app.settings";
import { BannerService } from "../_services/banner.service";

@Component({
    moduleId: module.id,
    selector: 'bannerSide',
    templateUrl: '/views/banner-side.component.html',
})
export class BannerSideComponent implements OnChanges {
    @Input() module: string = null;
    @Input() moduleId: string = null;
    @Input() place: number;
    bannersSide: Banner[] = [];

    public readonly mediaPath = AppSettings.MEDIA_PATH + "/banners/";

    constructor(private service: BannerService) { }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

        if (changes['moduleId'].currentValue != changes['moduleId'].previousValue) {
            switch (this.module) {
                case 'category':
                    this.service.getBannersFromCategory(this.moduleId, this.place)
                        .then(banners => this.bannersSide = banners)
                        .catch(error => console.log(error));
                    break;

                case 'brand':
                    this.service.getBannersFromBrand(this.moduleId, this.place)
                        .then(banners => this.bannersSide  = banners)
                        .catch(error => console.log(error));
                    break;

                case 'group':
                    this.service.getBannersFromGroup(this.moduleId, this.place)
                        .then(banners => this.bannersSide  = banners)
                        .catch(error => console.log(error));
                    break;

                default:
                    this.service.getBannersFromCategory(this.moduleId, this.place)
                        .then(banners => this.bannersSide  = banners)
                        .catch(error => console.log(error));
                    break;
            }
        }
    }

    isMobile(): boolean {
        return AppSettings.isMobile();
    }
}