import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformServer } from "@angular/common";
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Injector } from '@angular/core';
import { SeoManager } from "../../managers/seo.manager";
import { RedirectFrom } from "../../models/redirect301/redirectFrom";

@Component({
    selector: 'not-found',
    templateUrl: '../../templates/not-found/not-found.html',
    styleUrls: ['../../templates/not-found/not-found.scss']
})
export class NotFoundComponent implements OnInit {

    redirectFrom: RedirectFrom;

    constructor(
        private seoManager: SeoManager,
        private injector: Injector,
        @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit() {
        if (isPlatformServer(this.platformId)) {
            const response = this.injector.get(RESPONSE);
            response.status(404);
        }

        this.seoManager.setTags({
            title: 'Não Encontrado',
            description: 'Não Encontrado',
        });
    }
}