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
import { ShowCaseBanner } from "app/models/showcase/showcase-banner";
import { EnumBannerType } from "app/enums/banner-type.enum";
import { Globals } from "app/models/globals";

//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'showcase',
    templateUrl: '../../views/showcase.component.html'
})
export class ShowCaseComponent {
	banners: ShowCaseBanner[] = [];
	stripeBanners: ShowCaseBanner[] = [];
	halfBanners: ShowCaseBanner[] = [];
	groups: Group[] = [];
	showcase: ShowCase = new ShowCase();

    constructor (
		private titleService: Title,
		private service: ShowCaseService,
		private groupService: GroupService,
		private productService: ProductService,
		private globals: Globals,
		private metaService: Meta,
	){ }

	ngOnInit(){
		this.service.getShowCase()
		.then(showcase => {
			this.showcase = showcase;
			this.banners = showcase.pictures.filter(b => b.bannerType == EnumBannerType.Full);
			this.stripeBanners = showcase.pictures.filter(b => b.bannerType == EnumBannerType.Tarja);
			this.halfBanners = showcase.pictures.filter(b => b.bannerType == EnumBannerType.Half);

			let title = (this.showcase.metaTagTitle) ? this.showcase.metaTagTitle : this.showcase.name;
			this.metaService.addTags([
				{ name: 'title', content: this.showcase.metaTagTitle },
				{ name: 'description', content: this.showcase.metaTagDescription }
			]);
			AppSettings.setTitle(title, this.titleService);
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

	getStore(): Store{
		return this.globals.store;
	}
		
}