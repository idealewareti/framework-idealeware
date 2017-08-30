import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { Group } from "app/models/group/group";
import { AppSettings } from "app/app.settings";
import { Store } from "app/models/store/store";
import { ProductService } from "app/services/product.service";

declare var $:any;

@Component({
    moduleId: module.id,
    selector: 'showcase-group',
    templateUrl: '../../views/showcase-group.component.html',
    styleUrls: ['../../styles/showcase-group.component.css']
})
export class ShowcaseGroupComponent implements OnInit {
    @Input() group: Group;
	@Input() store: Store;
    
    constructor(private productService: ProductService) { }

    ngOnInit() {
		this.productService.getProductsFromShowcaseGroup(this.group.id)
		.then(products => {
			this.group.products = products;
		})
		.catch(error => console.log(error));
	 }

    ngAfterViewChecked() {
        if(this.group.products
		&& $(`#group-${this.group.id}`).children('li').length > 3 
		&& $(`#group-${this.group.id}`).children('.owl-stage-outer').length == 0){
        
            $(`#group-${this.group.id}`).owlCarousel({
                items: 4,
				margin: 10,
				loop: true,
				nav: true,
				navText: [
                    '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                    '<i class="fa fa-angle-right" aria-hidden="true"></i>'
                ],
				dots: false,
				autoplay: true,
				autoplayTimeout: 5000,
				autoplayHoverPause: true,
				responsive : {
				    0 : { items: 1 },
				    768 : { items: 3 },
				    992 : { items: 4 },
				    1200 : { items : 4 }
				}
			});
		}  
		else {
            $('.produtos-relacionados ul.showcase-items').show();
        } 
    }

	isMobile(): boolean{
		return AppSettings.isMobile();
	}

	hasProducts(): boolean{
		if(this.group.products && this.group.products.length > 0)
			return true;
		else return false;
	}
}