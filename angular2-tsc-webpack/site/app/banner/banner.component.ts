import { Component, Input, OnInit, SimpleChange, OnChanges, OnDestroy } from '@angular/core';
import { Banner } from '../_models/banner/banner';
import { BannerService } from '../_services/banner.service';
import { AppSettings } from "../app.settings";
//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'banner',
    templateUrl: '/views/banner.component.html',
})
export class BannerComponent implements OnChanges {
    @Input() module: string = null;
    @Input() moduleId: string = null;
    @Input() place: number;
    bannersTop: Banner[] = [];

    public readonly mediaPath = AppSettings.MEDIA_PATH + "/banners/";
    public items: string[] = [];
    public options = { items: 1, dots: false, navigation: true }
    public carouselClasses: string[] = ['owl-theme', 'owl-carousel', 'list-style-none'];


    constructor(private service: BannerService) { }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

        if (changes['moduleId'] || changes['module']) {
            this.destroyCarousel();
            switch (this.module) {
                case 'category':
                    this.service.getBannersFromCategory(this.moduleId, this.place)
                        .then(banners => {
                            this.bannersTop = banners;
                            // this.buildCarousel();
                        })
                        .catch(error => console.log(error));
                    break;

                case 'brand':
                    this.service.getBannersFromBrand(this.moduleId, this.place)
                        .then(banners => {
                            this.bannersTop = banners;
                            // this.buildCarousel();
                        })
                        .catch(error => console.log(error));
                    break;

                case 'group':
                    this.service.getBannersFromGroup(this.moduleId, this.place)
                        .then(banners => {
                            this.bannersTop = banners;
                            // this.buildCarousel();
                        })
                        .catch(error => console.log(error));
                    break;

                default:
                    this.service.getBannersFromCategory(this.moduleId, this.place)
                        .then(banners => {
                            this.bannersTop = banners;
                            // this.buildCarousel();
                        })
                        .catch(error => console.log(error));
                    break;
            }
        }

        // this.bannersTop.forEach(banner => {
        //     this.items.push(`${this.mediaPath}${banner.picture}`);
        // });
    }

    ngAfterViewChecked() {
        this.buildCarousel();
    }

    ngOnDestroy() {
        this.destroyCarousel();
    }

    buildCarousel(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.place == 1 
                && this.bannersTop.length > 0
                && $('#banner-tarja ul').children('li').length > 1
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

        })
    }

    destroyCarousel() {
        let $owl = $('#banner-tarja .tarja-slider');
        $owl.owlCarousel();
        $owl.trigger('destroy.owl.carousel');
        this.bannersTop = [];
    }

    isMobile(): boolean {
        return AppSettings.isMobile();
    }
}