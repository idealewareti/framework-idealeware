import { Component, Input, OnInit, AfterContentChecked, OnDestroy } from '@angular/core';
import {
    ActivatedRoute,
    Router,
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router';
import { Institutional } from '../../../models/institutional/institutional';
import { InstitutionalService } from '../../../services/institutional.service';
import { Title, Meta } from "@angular/platform-browser";

@Component({
    moduleId: module.id,
    selector: 'app-institutional',
    templateUrl: '../../../template/institutional/institutional/institutional.html',
    styleUrls: ['../../../template/institutional/institutional/institutional.scss']
})
export class InstitutionalComponent implements OnInit {

    @Input() id: string;
    institutional: Institutional;


    constructor(
        private service: InstitutionalService,
        private parentRouter: Router,
        private route: ActivatedRoute,
        private titleService: Title,
        private metaService: Meta,
    ) {
        this.institutional = new Institutional();
    }


    ngOnInit() {
        this.route.params
            .map(params => params['id'])
            .subscribe((id) => {
                this.institutional = null;

                if (id)
                    this.loadPage(id);
                else
                    this.getDefault();
            });
    }


    getDefault() {
        this.service.getDefault()
            .subscribe(response => {
                this.institutional = response;
                this.titleService.setTitle(this.institutional.metaTagTitle);
                this.metaService.addTags([
                    { name: 'title', content: this.institutional.metaTagTitle },
                    { name: 'description', content: this.institutional.metaTagDescription }
                ]);
            }, error => {
                console.log(error);
                this.parentRouter.navigateByUrl(`/404`);
            });
    }

    private loadPage(id) {
        this.service.getById(id)
            .subscribe(response => {
                this.institutional = response;
                this.titleService.setTitle(this.institutional.metaTagTitle);
                this.metaService.addTags([
                    { name: 'title', content: this.institutional.metaTagTitle },
                    { name: 'description', content: this.institutional.metaTagDescription }
                ]);

            }, error => {
                console.log(error);
                this.parentRouter.navigateByUrl(`/404`);
            });
    }

    isContactPage(): boolean {
        if (!this.institutional.allowDelete)
            return true;
        else
            return false;
    }
}