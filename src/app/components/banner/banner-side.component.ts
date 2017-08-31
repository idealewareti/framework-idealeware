import { Component, OnChanges, Input, SimpleChange } from "@angular/core";
import { Banner } from "app/models/banner/banner";
import { AppSettings } from "app/app.settings";
import { BannerService } from "app/services/banner.service";
import { Globals } from "app/models/globals";

@Component({
    moduleId: module.id,
    selector: 'bannerSide',
    templateUrl: '../../views/banner-side.component.html',
})
export class BannerSideComponent implements OnChanges {
    @Input() module: string = null;
    @Input() moduleId: string = null;
    @Input() place: number;
    bannersSide: Banner[] = [];

    mediaPath: string;

    constructor(private service: BannerService, private globals: Globals) {
        this.mediaPath = `${this.globals.store.link}/static/banners/`;
     }

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