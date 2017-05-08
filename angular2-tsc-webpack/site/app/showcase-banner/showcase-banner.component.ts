import { Component, OnInit, Input, AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
import { ShowCaseBanner } from "../_models/showcase/showcase-banner";
import { AppSettings } from "../app.settings";
import {OwlCarousel} from 'angular-owl-carousel';

//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'showcase-banner',
    templateUrl: '/views/showcase-banner.component.html',
    styleUrls: ['/styles/showcase-banner.component.css']
})
export class ShowcaseBannerComponent implements OnInit {
    
    @Input() banners: ShowCaseBanner[];
    
    public readonly mediaPath = `${AppSettings.MEDIA_PATH}/showcases/`;
    public items: string[] = [];
    public options = {items: 1, dots: false, navigation: true}
    public carouselClasses: string[] = ['owl-theme', 'owl-carousel', 'list-style-none'];
    constructor() { }

    ngOnInit() {
        this.banners.forEach(banner => {
            this.items.push(`${this.mediaPath}${banner.fullBanner}`);
        });
    }

    ngAfterViewChecked() {
        if(this.banners
		&& $('#main-banner ul').children('li').length > 1 
		&& $('#main-banner ul').children('.owl-stage-outer').length == 0){
        
            $("#main-banner ul").owlCarousel({
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
                autoplayHoverPause: true
            });
		}   
        
    }

    isMobile(): boolean{
        return AppSettings.isMobile();
    }

}
