import { Component, OnInit, AfterViewChecked, AfterViewInit, Input } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {HttpClient} from 'app/helpers/httpclient';
import {AppSettings} from 'app/app.settings';
import {Category} from 'app/models/category/category';
import {CategoryService} from 'app/services/category.service';
import { NgProgressService } from "ngx-progressbar";

declare var S: any;
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'category-menu',
    templateUrl: '../../views/category-nav.component.html'
})
export class CategoryNavComponent {

    @Input() isLoggedIn: boolean = false;
    categories: Category[] = [];
    readonly mediaPath: string = `${AppSettings.MEDIA_PATH}/categories/` ;
    

    constructor(
        http: Http,
        private loaderService: NgProgressService,
        private service: CategoryService
    ){

        this.service.getTree()
            .then(categories => {
                this.categories = categories;
            })
            .catch(error => console.log(error));
    }

    ngAfterViewChecked() {}

    ngAfterViewInit() {
        $(document).on('click','.navbar-collapse.in',function(e) {
            if( $(e.target).is('a') ) {
                $(this).collapse('hide');
            }
        });
    }

    isMobile(): boolean{
        return AppSettings.isMobile();
    }
}