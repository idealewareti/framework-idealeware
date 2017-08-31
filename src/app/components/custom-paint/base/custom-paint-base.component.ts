import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { AppSettings } from "app/app.settings";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomPaintManufacturer } from "app/models/custom-paint/custom-paint-manufacturer";
import { CustomPaintService } from "app/services/custom-paint.service";
import { CustomPaintCombination } from "app/models/custom-paint/custom-paint-combination";
import { CartManager } from "app/managers/cart.manager";
import { Store } from "app/models/store/store";
import { StoreService } from "app/services/store.service";
import { Globals } from "app/models/globals";

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'custom-paint-base',
    templateUrl: '../../../views/custom-paint-base.component.html',
})
export class CustomPaintBaseComponent implements OnInit {
    manufacturer: CustomPaintManufacturer = new CustomPaintManufacturer();
    manufacuterId: string;
    colorCode: string;
    optionId: string;
    modality: number = 1;
    paints: CustomPaintCombination[] = [];
    mediaPath: string;
    private store: Store;

    constructor(
        private service: CustomPaintService, 
        private storeService: StoreService,
        private titleService: Title,
        private route: ActivatedRoute,
        private parentRouter: Router,
        private manager: CartManager,
        private globals: Globals

    ) { }

    ngOnInit() {
        this.mediaPath = `${this.globals.store.link}/static/custompaint`;

        this.route.params
        .map(params => params)
        .subscribe((params) => {
            this.manufacuterId = params['manufacturer'];
            this.colorCode = params['color'];
            this.optionId = params['option'];
            this.getManufacturer(this.manufacuterId);
            this.getPaints(this.manufacuterId, this.colorCode, this.optionId);
        });
    }

    /* Loaders */
    getManufacturer(id: string){
        this.service.getManufacturers()
        .then(manufacturers => {
            this.manufacturer = manufacturers.filter(m => m.manufacturer === id)[0];
            AppSettings.setTitle(`Cores Personalizadas ${this.manufacturer.name} - Selecione seu produto`, this.titleService);

        })
        .catch(error => console.log(error));
    }

    getPaints(manufacturer: string, colorCode: string, optionId: string){
        this.service.getPaints(manufacturer, colorCode, optionId)
        .then(paints => {
            this.paints = paints;
            return this.storeService.getInfo();
        })
        .then(store => {
            this.store = store;
            this.modality = store.modality;
        })
        .catch(error => {
            console.log(error);
        });
    }

    showValues(): boolean {
        if(this.store)
            return false;
        else if (this.modality == 1)
            return true;
        else if (this.modality == 0 && this.store.settings.find(s => s.type == 3 && s.status == true)) 
            return true;
                else return false;
    }

    coverImg(paint: CustomPaintCombination): string{
        if(paint.picture)
            return `${this.mediaPath}/${paint.picture}`;
        else
            return '/assets/images/no-image.jpg';
    }

    /* Actions */
    purchase(paint: CustomPaintCombination, event = null){
        if(event)
            event.preventDefault();

        this.manager.purchasePaint(paint, this.manufacturer.manufacturer, 1)
        .then(cart => {
            this.parentRouter.navigateByUrl('/carrinho');
        })
        .catch(error => {
            let message = '';
            if(error.status === 0)
                message = 'Conexão perdida';
            else if(error.status === 500)
                message = 'Erro no servidor';
            else if(error.text().split('|').length > 1)
                message = error.text().split('|')[1].replace(/"/g, '');
            else
                message = error.text().replace(/"/g, '');
            
            console.log(error);
            
            swal('Erro ao adicionar ao carrinho', message, 'error');
        });
    }
}