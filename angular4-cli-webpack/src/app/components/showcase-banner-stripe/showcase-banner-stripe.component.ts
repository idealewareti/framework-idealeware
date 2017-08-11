import { Component, OnInit, Input } from '@angular/core';
import { ShowCaseBanner } from "app/models/showcase/showcase-banner";
import { AppSettings } from "app/app.settings";

@Component({
    selector: 'showcase-banner-stripe',
    templateUrl: '../../views/showcase-banner-stripe.component.html'
})
export class ShowcaseBannerStripeComponent implements OnInit {
    @Input() banners: ShowCaseBanner[];
    readonly mediaPath = `${AppSettings.MEDIA_PATH}/showcases/`;
    
    constructor() { }

    ngOnInit() { }

    calcWidthMedium(): number{
        let total: number = this.banners.length
        if(total > 1 && total <= 4)
            return 12 / total;
        else return 12
    }
}