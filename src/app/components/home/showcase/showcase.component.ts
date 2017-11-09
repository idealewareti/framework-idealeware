import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { PLATFORM_ID, Inject, Input } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Globals } from '../../../models/globals';
import { ShowCaseService } from '../../../services/showcase.service';
import { ShowCaseBanner } from '../../../models/showcase/showcase-banner';
import { ShowCase } from '../../../models/showcase/showcase';
import { EnumBannerType } from '../../../enums/banner-type.enum';
import { Store } from '../../../models/store/store';
import { AppCore } from '../../../app.core';
import { StoreService } from '../../../services/store.service';
import { ShowcaseGroup } from '../../../models/showcase/showcase-group';

@Component({
    selector: 'app-showcase',
    templateUrl: '../../../template/home/showcase/showcase.html',
    styleUrls: ['../../../template/home/showcase/showcase.scss']
})
export class ShowcaseComponent implements OnInit {
    banners: ShowCaseBanner[] = [];
	stripeBanners: ShowCaseBanner[] = [];
	halfBanners: ShowCaseBanner[] = [];
	groups: ShowcaseGroup[] = [];
    showcase: ShowCase = new ShowCase();
    store: Store = new Store();

    constructor(
        private titleService: Title,
		private metaService: Meta,
        private service: ShowCaseService,
        private storeService: StoreService,
        private globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
       this.fetchStore()
       .then(store => {
           this.store = store;
            return this.service.getShowCase();
        })
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
            
            this.titleService.setTitle(showcase.metaTagTitle);
		})
		.catch(error => console.log(error));
	}

	ngOnDestroy() {
		this.showcase = null;
        this.metaService.removeTag("name='title'");
        this.metaService.removeTag("name='description'");
    }

    private fetchStore(): Promise<Store> {
        return new Promise((resolve, reject) => {
            this.storeService.getStore()
            .subscribe(response  => {
                let store: Store = new Store(response);
                resolve(store);
            }, error => {
                reject(error);
            });
        });
    }
    
    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;            
    }

	getStore(): Store{
		return this.store;
	}
}