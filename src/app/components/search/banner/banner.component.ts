import { Component, Input, OnInit, SimpleChange, OnChanges, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Banner } from '../../../models/banner/banner';
import { BannerService } from '../../../services/banner.service';
import { Globals } from "../../../models/globals";
import { isPlatformBrowser } from '@angular/common';
import { AppCore } from '../../../app.core';
import { Store } from '../../../models/store/store';													
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app-banner',
    templateUrl: '../../../template/search/banner/banner.html',
    styleUrls: ['../../../template/search/banner/banner.scss']
})
export class BannerComponent implements OnChanges {
    @Input() module: string = null;
    @Input() moduleId: string = null;
    @Input() place: number;
	@Input() store: Store;
    bannersTop: Banner[] = [];

    mediaPath: string;
    items: string[] = [];
    options = { items: 1, dots: false, navigation: true }
    carouselClasses: string[] = ['owl-theme', 'owl-carousel', 'list-style-none'];


    constructor(
        private service: BannerService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
		this.mediaPath = `${this.store.link}/static/banners/`;

        if (changes['moduleId'] || changes['module']) {
            this.destroyCarousel();
            switch (this.module) {
                case 'category':
                    this.service.getBannersFromCategory(this.moduleId, this.place)
                        .subscribe(banners => {
                            this.bannersTop = banners;
                            // this.buildCarousel();
                        }, error => console.log(error));
                    break;

                case 'brand':
                    this.service.getBannersFromBrand(this.moduleId, this.place)
                        .subscribe(banners => {
                            this.bannersTop = banners;
                            // this.buildCarousel();
                        }, error => console.log(error));
                    break;

                case 'group':
                    this.service.getBannersFromGroup(this.moduleId, this.place)
                        .subscribe(banners => {
                            this.bannersTop = banners;
                            // this.buildCarousel();
                        }, error => console.log(error));
                    break;

                default:
                    this.service.getBannersFromCategory(this.moduleId, this.place)
                        .subscribe(banners => {
                            this.bannersTop = banners;
                            // this.buildCarousel();
                        }, error => console.log(error));
                    break;
            }
        }

        // this.bannersTop.forEach(banner => {
        //     this.items.push(`${this.mediaPath}${banner.picture}`);
        // });
    }

    ngAfterViewChecked() {
        // this.buildCarousel();
    }

    ngOnDestroy() {
        this.destroyCarousel();
    }

    buildCarousel(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (isPlatformBrowser(this.platformId)) {
                if (this.place == 1
                    && this.bannersTop.length > 0
                    && $('#banner-tarja ul').children('li').length > 0
                    && $('#banner-tarja ul').children('.owl-stage-outer').length == 0) {

                    $("#banner-tarja ul").owlCarousel({
                        items: 1,
                        loop: true,
                        nav: true,
                        navText: [
                            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
                        ],
                        dots: true,
                        autoplay: true,
                        autoplayTimeout: 5000,
                        autoplayHoverPause: true,
                    });
                }
                resolve({});
            }
            else
                resolve({});
        })
    }

    destroyCarousel() {
        if (isPlatformBrowser(this.platformId)) {
            let $owl = $('#banner-tarja .tarja-slider');
            $owl.owlCarousel();
            $owl.trigger('destroy.owl.carousel');
            this.bannersTop = [];
        }
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }
}