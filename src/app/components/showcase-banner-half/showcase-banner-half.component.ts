import { Component, OnInit, Input } from '@angular/core';
import { ShowCaseBanner } from "app/models/showcase/showcase-banner";
import { AppSettings } from "app/app.settings";
import { Globals } from "app/models/globals";

@Component({
    selector: 'showcase-banner-half',
    templateUrl: '../../views/showcase-banner-half.component.html'
})
export class ShowcaseBannerHalfComponent implements OnInit {
    @Input() banners: ShowCaseBanner[];
    mediaPath: string;
    
    constructor(private globals: Globals) {}

    ngOnInit() {
        this.mediaPath = `${this.globals.store.link}/static/showcases/`;
     }
}