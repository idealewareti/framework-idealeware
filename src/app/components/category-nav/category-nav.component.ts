import { Component, OnInit, AfterViewChecked, AfterViewInit, Input } from '@angular/core';
import {HttpClient} from 'app/helpers/httpclient';
import {AppSettings} from 'app/app.settings';
import {Category} from 'app/models/category/category';
import {CategoryService} from 'app/services/category.service';
import { NgProgressService } from "ngx-progressbar";
import { Globals } from "app/models/globals";

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
    mediaPath: string;

    constructor(
        private loaderService: NgProgressService,
        private service: CategoryService,
        private globals: Globals
    ){
        this.mediaPath = `${this.globals.store.link}/static/categories/`;

        this.service.getTree()
        .then(categories => {
            this.categories = categories;
        })
        .catch(error => console.log(error));
    }

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