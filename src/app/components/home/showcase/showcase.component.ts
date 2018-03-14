import { Component, OnInit } from '@angular/core';
import { Title, Meta, makeStateKey, TransferState } from '@angular/platform-browser';
import { PLATFORM_ID, Inject, Input } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Globals } from '../../../models/globals';
import { ShowCaseService } from '../../../services/showcase.service';
import { ShowCaseBanner } from '../../../models/showcase/showcase-banner';
import { ShowCase } from '../../../models/showcase/showcase';
import { EnumBannerType } from '../../../enums/banner-type.enum';
import { Store } from '../../../models/store/store';
import { AppCore } from '../../../app.core';
import { ShowcaseGroup } from '../../../models/showcase/showcase-group';
import { Router } from '@angular/router';
import { AppConfig } from '../../../app.config';
import { StoreManager } from '../../../managers/store.manager';

const SHOWCASE_KEY = makeStateKey('showcase_key');
const STORE_KEY = makeStateKey('store_key');

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
        private storeManager: StoreManager,
        private globals: Globals,
        private router: Router,
        private state: TransferState,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.showcase = this.state.get(SHOWCASE_KEY, null as any);
        this.groups = (this.showcase && this.showcase.groups) ? this.showcase.groups : [];
        this.store = this.state.get(STORE_KEY, null as any);
        this.storeManager.getStore()
            .then(store => {
                this.store = store;
                this.state.set(STORE_KEY, store as any);

                if (this.showcase) {
                    this.initData(this.showcase);
                    return;
                }

                this.service.getShowCase()
                    .subscribe(showcase => {
                        this.state.set(SHOWCASE_KEY, showcase as any);
                        this.showcase = showcase;
                        this.initData(showcase);
                    }, error => console.log(error));
            })
            .catch(error => {
                console.log(error);
            });
    }

    ngOnDestroy() {
        this.showcase = null;
        this.metaService.removeTag("name='title'");
        this.metaService.removeTag("name='description'");
    }

    private initData(data: ShowCase): void {
        this.groups = data.groups;
        this.banners = data.pictures.filter(b => b.bannerType == EnumBannerType.Full);
        this.stripeBanners = data.pictures.filter(b => b.bannerType == EnumBannerType.Tarja);
        this.halfBanners = data.pictures.filter(b => b.bannerType == EnumBannerType.Half);

        let title = (data.metaTagTitle) ? data.metaTagTitle : data.name;
        this.metaService.addTags([
            { name: 'title', content: data.metaTagTitle },
            { name: 'description', content: data.metaTagDescription }
        ]);
        this.titleService.setTitle(data.metaTagTitle);
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }

    getStore(): Store {
        return this.store;
    }
}