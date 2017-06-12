import {Component, AfterViewChecked, OnInit} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {HttpClient} from 'app/helpers/httpclient';
import {AppSettings} from 'app/app.settings';
import {Brand} from 'app/models/brand/brand';
import {BrandService} from 'app/services/brand.service';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'brand-nav',
    templateUrl: '../../views/brand-nav.component.html',
	styleUrls: ['../../styles/brand-nav.component.css']
})
export class BrandNavComponent {

    brands: Brand[] = [];

    constructor(private service: BrandService){}

	ngOnInit() {
		this.service.getAll()
		.then(brands => {
			this.brands = brands;
			this.removeBrandWithoutPicture();
			this.brands.forEach(brand => brand.picture = `${AppSettings.MEDIA_PATH}/brands/${brand.picture}`);
		})
		.catch(e => console.log(e));
	}

	private removeBrandWithoutPicture(){
		let index = this.brands.findIndex(b => b.picture == '');
		if(index >= 0)
			this.brands.splice(index, 1);
	}

	ngAfterViewChecked(){
		if(this.brands
			&& this.brands.length > 4
			&& $('#list-brads ul').children('li').length > 0 
			&& $('#list-brads ul').children('.owl-stage-outer').length == 0
		){
			$("#list-brads ul").owlCarousel({
				items: 5,
				margin: 10,
				loop: true,
				nav: true,
				navText: [
					'<i class="fa fa-angle-left" aria-hidden="true"></i>',
					'<i class="fa fa-angle-right" aria-hidden="true"></i>'],
				dots: false,
				autoplay: true,
				autoplayTimeout: 5000,
				autoplayHoverPause: true,
				responsive : {
				    0 : { items : 2 },
				    768 : { items : 3 },
				    992 : { items : 4 },
				    1200 : { items : 5 }
				}
			});
		}
	}
    
}