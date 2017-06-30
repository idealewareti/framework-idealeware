import {Component, AfterViewChecked, OnInit, OnDestroy} from '@angular/core';
import {Http} from '@angular/http';
import {ShowCase} from 'app/models/showcase/showcase';
import {Group} from 'app/models/group/group';
import {Product} from 'app/models/product/product';
import { Title, Meta } from '@angular/platform-browser';
import {ShowCaseService} from 'app/services/showcase.service';
import {GroupService} from 'app/services/group.service';
import { ProductService } from 'app/services/product.service';
import { AppSettings } from "app/app.settings";
import { Store } from "app/models/store/store";
import { StoreService } from "app/services/store.service";

//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'showcase',
    templateUrl: '../../views/showcase.component.html'
})
export class ShowCaseComponent {
	banners: Object[] = [];
	groups: Group[] = [];
	showcase: ShowCase = new ShowCase();
	store: Store

    constructor (
		private titleService: Title,
		private service: ShowCaseService,
		private groupService: GroupService,
		private productService: ProductService,
		private storeService: StoreService,
		private metaService: Meta,
	){ }

	ngOnInit(){
		this.service.getShowCase()
			.then(showcase => {
				this.showcase = showcase;
				let title = (this.showcase.metaTagTitle) ? this.showcase.metaTagTitle : this.showcase.name;
				this.metaService.addTags([
                    { name: 'title', content: this.showcase.metaTagTitle },
                    { name: 'description', content: this.showcase.metaTagDescription }
                ]);
				AppSettings.setTitle(title, this.titleService);
			})
			.catch(error => console.log(error));
		
		this.storeService.getInfo()
			.then((store) => {
				this.store = store;
			})
			.catch(error => console.log(error));
			
	}

	ngOnDestroy() {
		this.showcase = null;
        this.metaService.removeTag("name='title'");
        this.metaService.removeTag("name='description'");
	}

	ngAfterViewChecked() {}

	isMobile(): boolean{
		return AppSettings.isMobile();
	}
		
}