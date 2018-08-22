import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Institutional } from '../../../models/institutional/institutional';
import { SeoManager } from '../../../managers/seo.manager';

@Component({
    selector: 'institutional',
    templateUrl: '../../../templates/institutional/institutional/institutional.html',
    styleUrls: ['../../../templates/institutional/institutional/institutional.scss']
})
export class InstitutionalComponent implements OnInit {

    institutional: Institutional;

    constructor(
        private seoManager: SeoManager,
        private activatedRoute: ActivatedRoute,
    ) { }


    ngOnInit() {
        this.activatedRoute.params.subscribe(() => {
            this.institutional = this.activatedRoute.snapshot.data.institutional;
            this.seoManager.setTags({
                title: this.institutional.metaTagTitle,
                description: this.institutional.metaTagDescription
            });
        });
    }

    isContactPage(): boolean {
        if (!this.institutional.allowDelete)
            return true;
        else
            return false;
    }
}