import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformServer } from "@angular/common";
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Injector } from '@angular/core';
import { SeoManager } from "../../managers/seo.manager";

@Component({
    selector: 'internal-server-error',
    templateUrl: '../../templates/internal-server-error/internal-server-error.html',
    styleUrls: ['../../templates/internal-server-error/internal-server-error.scss']
})
export class InternalServerErrorComponent implements OnInit {


    constructor(
        private seoManager: SeoManager,
        private injector: Injector,
        @Inject(PLATFORM_ID) private platformId: Object) {
    }
    ngOnInit() {
        if (isPlatformServer(this.platformId)) {
            const response = this.injector.get(RESPONSE);
            response.status(500);
        }

        this.seoManager.setTags({
            title: 'Não Encontrado',
            description: 'Não Encontrado',
        });
    }
}