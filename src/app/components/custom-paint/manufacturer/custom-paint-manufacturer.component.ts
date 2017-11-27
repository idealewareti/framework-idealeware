import { Component, OnInit } from '@angular/core';
import { CustomPaintManufacturer } from "../../../models/custom-paint/custom-paint-manufacturer";
import { CustomPaintService } from "../../../services/custom-paint.service";
import { Title } from "@angular/platform-browser";
import { Globals } from '../../../models/globals';
import { StoreService } from '../../../services/store.service';
import { Store } from '../../../models/store/store';

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
        private globals: Globals
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
        return new Promise((resolve, reject) => {
            this.storeService.getStore()
                .subscribe(response => {
                    let store: Store = new Store(response);
                    resolve(store);
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