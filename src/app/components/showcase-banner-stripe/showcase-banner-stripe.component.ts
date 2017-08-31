import { Component, OnInit, Input } from '@angular/core';
import { ShowCaseBanner } from "app/models/showcase/showcase-banner";
import { AppSettings } from "app/app.settings";
import { Globals } from "app/models/globals";

@Component({
    selector: 'showcase-banner-stripe',
    templateUrl: '../../views/showcase-banner-stripe.component.html'
})
export class ShowcaseBannerStripeComponent implements OnInit {
    @Input() banners: ShowCaseBanner[];
    mediaPath: string;
    
    constructor(private globals: Globals) { }

    ngOnInit() {
        this.mediaPath = `${this.globals.store.link}/static/showcases/`;
     }

    calcWidthMedium(): number{
        let total: number = this.banners.length
        if(total > 1 && total <= 4)
            return 12 / total;
        else return 12
    }
}