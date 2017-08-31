import { Component, Input, OnInit } from '@angular/core';
import { Product } from "app/models/product/product";
import { Router } from "@angular/router";
import { AppSettings } from "app/app.settings";
import { Globals } from "app/models/globals";

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'quickview',
    templateUrl: '../../views/quickview.component.html',
    styleUrls: ['../../styles/quickview.component.css']
})
export class QuickViewComponent implements OnInit {
    
    @Input() product: Product;
    mediaPath: string;
    promotionalPrice: number = 0;
    
    constructor(private parentRouter: Router, private globals: Globals) { }

    ngOnInit() {
        this.mediaPath = `${this.globals.store.link}/static/products/`;
     }

    open(event, id){
        this.parentRouter.navigateByUrl(`/produto/${id}/${this.product.niceName}`);
        $(document).on('click', '.btn-close-clickview', function () {
            $('.quickview-box').fadeOut();
        });
    }
}