import { Component, OnInit } from '@angular/core';
import { CustomPaintColor } from "app/models/custom-paint/custom-paint-color";
import { CustomPaintService } from "app/services/custom-paint.service";
import { Title } from "@angular/platform-browser";
import { AppSettings } from "app/app.settings";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomPaintManufacturer } from "app/models/custom-paint/custom-paint-manufacturer";
import { CustomPaintVariation } from "app/models/custom-paint/custom-paint-variation";
import { CustomPaintOption } from "app/models/custom-paint/custom-paint-option";
import { Globals } from "app/models/globals";

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'custom-paint-variation',
    templateUrl: '../../../views/custom-paint-variation.component.html',
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
        private globals: Globals
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
    getManufacturer(id: string){
        this.service.getManufacturers()
        .then(manufacturers => {
            this.manufacturer = manufacturers.filter(m => m.manufacturer === id)[0];
            AppSettings.setTitle(`Cores Personalizadas ${this.manufacturer.name} - Selecione o tamanho`, this.titleService);

        })
        .catch(error => console.log(error));
    }

    getVariation(id: string){
        this.service.getVariations(id)
        .then(variation => {
            this.variation = variation;
        })
        .catch(error => {
            console.log(error);
        })
    }

    selectOption(option: CustomPaintOption, event = null){
        if(event)
            event.preventDefault();

        this.optionSelected = option;

        this.nextStep(null);
    }

    isOptionSelected(option: CustomPaintOption): boolean{
        if(this.optionSelected && this.optionSelected.id == option.id)
            return true;
        else
            return false;
    }

    nextStep(event){
        if(event)
            event.preventDefault();
        
        if(!this.optionSelected){
            swal('Erro', 'Nenhuma opção selecionada', 'error');
            return;
        }
        else{
            let url: string = `/corespersonalizadas/${this.manufacturer.manufacturer}/${this.colorCode}/${this.optionSelected.id}`;
            this.parentRouter.navigateByUrl(url);
        }

    }
}