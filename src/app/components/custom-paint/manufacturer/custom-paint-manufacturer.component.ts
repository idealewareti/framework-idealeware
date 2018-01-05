import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CustomPaintManufacturer } from "../../../models/custom-paint/custom-paint-manufacturer";
import { CustomPaintService } from "../../../services/custom-paint.service";
import { Title } from "@angular/platform-browser";
import { Globals } from '../../../models/globals';
import { StoreService } from '../../../services/store.service';
import { Store } from '../../../models/store/store';
import { isPlatformBrowser } from '@angular/common';
import { AppConfig } from '../../../app.config';

@Component({
    moduleId: module.id,
    selector: 'app-custom-paint-manufacturer',
    templateUrl: '../../../template/custom-paint/custom-paint-manufacturer/custom-paint-manufacturer.html',
    styleUrls: ['../../../template/custom-paint/custom-paint-manufacturer/custom-paint-manufacturer.scss']
})
export class CustomPaintManufacturerComponent implements OnInit {
    manufacturers: CustomPaintManufacturer[] = [];
    mediaPath: string = '';
    store: Store;

    constructor(
        private service: CustomPaintService,
        private storeService: StoreService,
        private titleService: Title,
        private globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.mediaPath = 'static/custompaint';
    }

    ngOnInit() {
        this.fetchStore()
            .then(store => {
                this.store = store;
            })
            .catch(error => {
                console.log(error);
            });
        this.titleService.setTitle('Cores Personalizadas');
        this.getManufacturers();
    }

    getManufacturers() {
        this.service.getManufacturers()
            .subscribe(manufacturers => this.manufacturers = manufacturers,
            error => console.log(error));
    }

    getColWidth(): string {
        if (this.manufacturers.length == 1)
            return 'col-md-12 col-sm-12';
        else if (this.manufacturers.length == 2)
            return 'col-md-6 col-sm-12';
        else
            return 'col-md-4 col-sm-12';
    }

    private fetchStore(): Promise<Store> {
        if (isPlatformBrowser(this.platformId)) {
            let store: Store = JSON.parse(sessionStorage.getItem('store'));
            if (store && store.domain == AppConfig.DOMAIN) {
                return new Promise((resolve, reject) => {
                    resolve(store);
                });
            }
        }
        return this.fetchStoreFromApi();
    }

    private fetchStoreFromApi(): Promise<Store> {
        return new Promise((resolve, reject) => {
            this.storeService.getStore()
                .subscribe(response => {
                    if (isPlatformBrowser(this.platformId)) {
                        sessionStorage.setItem('store', JSON.stringify(response));
                    }
                    resolve(response);
                }, error => {
                    reject(error);
                });
        });
    }

    getManufacturerPicture(manufacturer: CustomPaintManufacturer): string {
        if (manufacturer.picture) {
            return `${this.store.link}/${this.mediaPath}/${manufacturer.picture}`;
        }
        return 'assets/images/no-image.jpg';
    }
}