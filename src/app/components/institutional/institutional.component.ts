import { Component, Input, OnInit, AfterContentChecked, OnDestroy } from '@angular/core';
import { ActivatedRoute,
    Router,
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError } from '@angular/router';
import {NgProgressService} from 'ngx-progressbar';
import {Institutional} from 'app/models/institutional/institutional';
import { InstitutionalService } from 'app/services/institutional.service';
import { Title, Meta } from "@angular/platform-browser";
import { AppSettings } from "app/app.settings";

@Component({
    moduleId: module.id,
    selector: 'institutional',
    templateUrl: '../../views/institutional.component.html',
})
export class InstitutionalComponent implements OnInit {
    
    @Input() id: string;
    institutional: Institutional;
    
    
    constructor(
        private service: InstitutionalService,
        private loader: NgProgressService,
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

                if(id)
                    this.loadPage(id);
                else 
                    this.getDefault();
            });
        
    }


    getDefault(){
        this.loader.start();
        this.service.getDefault()
        .then(response => {
            this.institutional = response;
            AppSettings.setTitle(this.institutional.metaTagTitle, this.titleService);
            this.metaService.addTags([
                { name: 'title', content: this.institutional.metaTagTitle },
                { name: 'description', content: this.institutional.metaTagDescription }
            ]);
            this.loader.done();
            window.scrollTo(0, 0); // por causa das hash url
        })
        .catch(error => {
            this.loader.done();
            console.log(error);
            this.parentRouter.navigateByUrl(`/404`);
        });
    }

     private loadPage(id){
        this.loader.start();
        
        this.service.getById(id)
        .then(response => {
            this.institutional = response;
            AppSettings.setTitle(this.institutional.metaTagTitle, this.titleService);
            this.metaService.addTags([
                { name: 'title', content: this.institutional.metaTagTitle },
                { name: 'description', content: this.institutional.metaTagDescription }
            ]);
            this.loader.done();
            window.scrollTo(0, 0); // por causa das hash url

        })
        .catch(error => {
            this.loader.done();
            console.log(error);
            this.parentRouter.navigateByUrl(`/404`);
        });
     }

    isContactPage(): boolean{
        if(!this.institutional.allowDelete)
            return true;
        else
            return false;
    }
}