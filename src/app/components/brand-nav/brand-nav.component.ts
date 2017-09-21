import {Component, AfterViewChecked, OnInit} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {HttpClient} from 'app/helpers/httpclient';
import {AppSettings} from 'app/app.settings';
import {Brand} from 'app/models/brand/brand';
import {BrandService} from 'app/services/brand.service';
import { Globals } from "app/models/globals";

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'brand-nav',
    templateUrl: '../../views/brand-nav.component.html',
	styleUrls: ['../../styles/brand-nav.component.css']
})
export class BrandNavComponent {

    allBrands: Brand[] = [];
	brands: Brand[] = [];
	mediaPath: string;

    constructor(private service: BrandService, private globals: Globals){}

	ngOnInit() {
		this.mediaPath = `${this.globals.store.link}/static/brands`;

		this.service.getAll()
		.then(brands => {
			this.allBrands = brands;
			this.removeBrandWithoutPicture();
			this.brands.forEach(brand => brand.picture = `${this.mediaPath}/${brand.picture}`);
		})
		.catch(e => console.log(e));
	}

	private removeBrandWithoutPicture(){
		this.allBrands.forEach(brand => {
			if(brand.picture)
				this.brands.push(brand);
		});
	}

	ngAfterViewChecked(){
		if(this.brands
			&& this.brands.length > 4
			&& $('#list-brands ul').children('li').length > 0 
			&& $('#list-brands ul').children('.owl-stage-outer').length == 0
		){
			$("#list-brands ul").owlCarousel({
				items: 5,
				margin: 10,
				loop: true,
				nav: true,
				navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
				dots: false,
				autoplay: true,
				autoplayTimeout: 5000,
				autoplayHoverPause: true,
				// responsive : {
				//     0 : { items : 2 },
				//     768 : { items : 3 },
				//     992 : { items : 4 },
				//     1200 : { items : 5 }
				// }
			});
		}
	}
    
}