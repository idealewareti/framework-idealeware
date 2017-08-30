import { Component, OnInit, Input } from '@angular/core';
import { ShowCaseBanner } from "app/models/showcase/showcase-banner";
import { AppSettings } from "app/app.settings";

@Component({
    selector: 'showcase-banner-half',
    templateUrl: '../../views/showcase-banner-half.component.html'
})
export class ShowcaseBannerHalfComponent implements OnInit {
    @Input() banners: ShowCaseBanner[];
    readonly mediaPath = `${AppSettings.MEDIA_PATH}/showcases/`;
    
    constructor() { }

    ngOnInit() { }
}