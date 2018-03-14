import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CustomPaintManufacturer } from "../../../models/custom-paint/custom-paint-manufacturer";
import { CustomPaintService } from "../../../services/custom-paint.service";
import { Title } from "@angular/platform-browser";
import { Globals } from '../../../models/globals';
import { Store } from '../../../models/store/store';
import { isPlatformBrowser } from '@angular/common';
import { AppConfig } from '../../../app.config';
import { StoreManager } from '../../../managers/store.manager';

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
        private storeManager: StoreManager,
        private titleService: Title,
        private globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.mediaPath = 'static/custompaint';
    }

    ngOnInit() {
        this.storeManager.getStore()
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

    getManufacturerPicture(manufacturer: CustomPaintManufacturer): string {
        if (manufacturer.picture) {
            return `${this.store.link}/${this.mediaPath}/${manufacturer.picture}`;
        }
        return 'assets/images/no-image.jpg';
    }
}