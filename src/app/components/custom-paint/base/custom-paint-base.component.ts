import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomPaintManufacturer } from "../../../models/custom-paint/custom-paint-manufacturer";
import { CustomPaintService } from "../../../services/custom-paint.service";
import { CustomPaintCombination } from "../../../models/custom-paint/custom-paint-combination";
import { CartManager } from "../../../managers/cart.manager";
import { Store } from "../../../models/store/store";
import { StoreService } from "../../../services/store.service";
import { Globals } from "../../../models/globals";
import { EnumStoreModality } from '../../../enums/store-modality.enum';
import { isPlatformBrowser } from '@angular/common';
import { CustomPaintColor } from '../../../models/custom-paint/custom-paint-color';

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'app-custom-paint-base',
    templateUrl: '../../../template/custom-paint/custom-paint-base/custom-paint-base.html',
    styleUrls: ['../../../template/custom-paint/custom-paint-base/custom-paint-base.scss']
})
export class CustomPaintBaseComponent implements OnInit {
    manufacturer: CustomPaintManufacturer = new CustomPaintManufacturer();
    manufacuterId: string;
    colorCode: string;
    optionId: string;
    modality: number = 1;
    paints: CustomPaintCombination[] = [];
    mediaPath: string;
    store: Store;

    constructor(
        private service: CustomPaintService,
        private storeService: StoreService,
        private titleService: Title,
        private route: ActivatedRoute,
        private parentRouter: Router,
        private manager: CartManager,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {

        this.mediaPath = 'static/custompaint';
    }

    ngOnInit() {

        this.route.params
            .map(params => params)
            .subscribe((params) => {
                this.fetchStore()
                    .then(store => {
                        this.store = store;
                        this.modality = this.store.modality;
                    })
                    .catch(error => {
                        console.log(error);
                    });
                this.manufacuterId = params['manufacturer'];
                this.colorCode = params['color'];
                this.optionId = params['option'];
                this.getManufacturer(this.manufacuterId);
                this.getPaints(this.manufacuterId, this.colorCode, this.optionId);
            });
    }

    /* Loaders */
    getManufacturer(id: string) {
        this.service.getManufacturers()
            .subscribe(manufacturers => {
                this.manufacturer = manufacturers.filter(m => m.manufacturer === id)[0];
                this.titleService.setTitle(`Cores Personalizadas ${this.manufacturer.name} - Selecione seu produto`);

            }, error => console.log(error));
    }

    getPaints(manufacturer: string, colorCode: string, optionId: string) {
        this.service.getPaints(manufacturer, colorCode, optionId)
            .subscribe(paints => {
                this.paints = paints;
            }, error => {
                console.log(error);
            });
    }

    showValues(): boolean {
        if (this.modality == EnumStoreModality.Ecommerce) {
            return true;
        }
        else if (this.modality == EnumStoreModality.Budget && this.store.settings.find(s => s.type == 3 && s.status == true)) {
            return true;
        }
        else return false;
    }

    getPaintPicture(paint: CustomPaintCombination): string {
        if (paint.picture) {
            return `${this.store.link}/${this.mediaPath}/${paint.picture}`;
        }
        else {
            return '/assets/images/no-image.jpg';
        }
    }

    /* Actions */
    purchase(paint: CustomPaintCombination, event = null) {
        if (isPlatformBrowser(this.platformId)) {
            if (event) {
                event.preventDefault();
            }

            this.manager.purchasePaint(localStorage.getItem('cart_id'), paint, this.manufacturer.manufacturer, 1)
                .then(cart => {
                    this.parentRouter.navigateByUrl('/carrinho');
                })
                .catch(error => {
                    let message = '';
                    if (error.status === 0)
                        message = 'Conexão perdida';
                    else if (error.status === 500)
                        message = 'Erro no servidor';
                    else if (error.text().split('|').length > 1)
                        message = error.text().split('|')[1].replace(/"/g, '');
                    else
                        message = error.text().replace(/"/g, '');

                    console.log(error);

                    swal('Erro ao adicionar ao carrinho', message, 'error');
                });
        }
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


    getColor(color: CustomPaintColor): string {
        if (/^\S{6}$/.test(color.rgb))
            return `#${color.rgb}`;
        else
            return `rgb(${color.rgb})`;
    }
}