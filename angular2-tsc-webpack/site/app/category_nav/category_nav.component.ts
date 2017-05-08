import {Component, OnInit, AfterViewChecked} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {HttpClient} from '../httpclient';
import {AppSettings} from '../app.settings';
import {Category} from '../_models/category/category';
import {CategoryService} from '../_services/category.service';
import { NgProgressService } from "ngx-progressbar";

declare var S: any;
//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'category-menu',
    templateUrl: '/views/category_nav.component.html'
})
export class CategoryNavComponent {

    categories: Category[] = [];
    public readonly mediaPath: string = `${AppSettings.MEDIA_PATH}/categories/` ;
    

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

    ngAfterViewChecked() {
        if(this.isMobile()){
            this.navActions();
        }
    }

    public isMobile(): boolean{
        return AppSettings.isMobile();
    }

    public navActions(){
        $('.btn-nav').click(function(event) {
            $('#nav .mask, #nav .lvl2').hide();
            $('#nav .lvl2').css('left', '-100%');
            $('#nav .content').css('left', '-100%');
            $('#nav').show();
            $('#nav .mask').fadeIn();
            $('#nav .content').css('left', 0);
            return false;
        });
        $('#nav a.has-children').click(function(event) {
            var $lvl2 = $(this).parents('li').find('.lvl2');
            $lvl2.show().css('left', 0);
            return false;
        });
        $('#nav .btn-back').click(function(event) {
            var $lvl2 = $(this).parents('.lvl2');
            $lvl2.css('left', '-100%').hide();
            return false;
        });
        $('#nav .btn-close,#nav .mask, #nav .lvl2-link').click(function(event) {
            $('#nav .lvl2').css('left', '-100%');
            $('#nav .lvl2').hide();
            $('#nav .content').css('left', '-100%');
            $('#nav .mask').fadeOut(300, function(){
                $('#nav').hide();
            });
            return false;
        });
    }    

}