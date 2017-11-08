import { Component, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject, Input } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Store } from '../../../models/store/store';
import { ShowcaseGroup } from '../../../models/showcase/showcase-group';
import { ProductService } from '../../../services/product.service';

@Component({
    selector: 'app-showcase-group',
    templateUrl: '../../../template/home/showcase-group/showcase-group.html',
    styleUrls: ['../../../template/home/showcase-group/showcase-group.scss']
})
export class ShowcaseGroupComponent implements OnInit {
    @Input() group: ShowcaseGroup;
    @Input() store: Store;
    
    constructor(
        private productService: ProductService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.productService.getProductsFromShowcaseGroup(this.group.id)
		.then(products => {
			this.group.products = products;
		})
		.catch(error => {
            console.log(error);
        });
     }

    hasProducts(): boolean{
		if(this.group.products && this.group.products.length > 0) {
			return true;
        }
		return false;
	}
}