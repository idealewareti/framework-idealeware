import { Component, Input, OnInit } from '@angular/core';
import { Product } from "../_models/product/product";
import { Router } from "@angular/router";
import { AppSettings } from "../app.settings";

//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'quickview',
    templateUrl: '/views/quickview.component.html',
    styleUrls: ['/styles/quickview.component.css']
})
export class QuickViewComponent implements OnInit {
    
    @Input() product: Product;
    mediaPath: string = AppSettings.MEDIA_PATH + '/products/';
    
    constructor(private parentRouter: Router) { }

    ngOnInit() { }

    open(event, id){
        this.parentRouter.navigateByUrl(`/produto/${id}/${this.product.niceName}`);
        $(document).on('click', '.btn-close-clickview', function () {
            $('.quickview-box').fadeOut();
        });
    }
}