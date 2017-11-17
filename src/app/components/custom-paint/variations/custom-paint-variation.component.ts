import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CustomPaintColor } from "../../../models/custom-paint/custom-paint-color";
import { CustomPaintService } from "../../../services/custom-paint.service";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomPaintManufacturer } from "../../../models/custom-paint/custom-paint-manufacturer";
import { CustomPaintVariation } from "../../../models/custom-paint/custom-paint-variation";
import { CustomPaintOption } from "../../../models/custom-paint/custom-paint-option";
import { Globals } from "../../../models/globals";
import { isPlatformBrowser } from '@angular/common';

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'app-custom-paint-variation',
    templateUrl: '../../../template/custom-paint/custom-paint-variation/custom-paint-variation.html',
    styleUrls: ['../../../template/custom-paint/custom-paint-variation/custom-paint-variation.scss']
})
export class CustomPaintVariationComponent implements OnInit {
    manufacturer: CustomPaintManufacturer = new CustomPaintManufacturer();
    manufacuterId: string;
    colorCode: string;
    variation: CustomPaintVariation = new CustomPaintVariation();
    optionSelected: CustomPaintOption = null;
    mediaPath: string;

    constructor(
        private service: CustomPaintService,
        private titleService: Title,
        private route: ActivatedRoute,
        private parentRouter: Router,
        private globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.mediaPath = `${this.globals.store.link}/static/custompaint/`;

        this.route.params
            .map(params => params)
            .subscribe((params) => {
                this.manufacuterId = params['manufacturer'];
                this.colorCode = params['color'];
                this.getManufacturer(this.manufacuterId);
                this.getVariation(this.manufacuterId);
            });
    }

    /* Loaders */
    getManufacturer(id: string) {
        this.service.getManufacturers()
            .subscribe(manufacturers => {
                this.manufacturer = manufacturers.filter(m => m.manufacturer === id)[0];
                this.titleService.setTitle(`Cores Personalizadas ${this.manufacturer.name} - Selecione o tamanho`);

            }, error => console.log(error));
    }

    getVariation(id: string) {
        this.service.getVariations(id)
            .subscribe(variation => {
                this.variation = variation;
            }, error => {
                console.log(error);
            })
    }

    selectOption(option: CustomPaintOption, event = null) {
        if (event)
            event.preventDefault();

        this.optionSelected = option;

        this.nextStep(null);
    }

    isOptionSelected(option: CustomPaintOption): boolean {
        if (this.optionSelected && this.optionSelected.id == option.id)
            return true;
        else
            return false;
    }

    nextStep(event) {
        if (isPlatformBrowser(this.platformId)) {
            if (event)
                event.preventDefault();

            if (!this.optionSelected) {
                swal('Erro', 'Nenhuma opção selecionada', 'error');
                return;
            }
            else {
                let url: string = `/corespersonalizadas/${this.manufacturer.manufacturer}/${this.colorCode}/${this.optionSelected.id}`;
                this.parentRouter.navigateByUrl(url);
            }
        }
    }
}