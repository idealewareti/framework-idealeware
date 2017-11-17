import { Component, Input, Output, EventEmitter, AfterViewChecked, AfterContentChecked, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Paleta } from '../../../models/self-color/paleta'
import { SelfColor } from '../../../models/self-color/self-color';
import { SelfColorService } from "../../../services/self-color.service";
import { SelfColorFamily } from "../../../models/self-color/self-color-family";
import { isPlatformBrowser } from '@angular/common';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app-self-color',
    templateUrl: '../../../template/product/self-color/self-color.html',
    styleUrls: ['../../../template/product/self-color/self-color.scss']
})
export class SelfColorComponent {

    private colorsLoaded: boolean = false;
    urlCores: string;
    families: SelfColorFamily[] = [];
    familySelected: SelfColorFamily = null;
    colors: SelfColor[] = [];
    findColor: string = null;
    colorSelected: SelfColor = null;

    @Input() selfColor: SelfColor;
    @Output() colorUpdated: EventEmitter<SelfColor> = new EventEmitter<SelfColor>();

    constructor(
        private service: SelfColorService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.families = [
            new SelfColorFamily({ id: '8', name: 'off-whites' }),
            new SelfColorFamily({ id: '9', name: 'tons-pastel' }),
            new SelfColorFamily({ id: '1', name: 'vermelhos' }),
            new SelfColorFamily({ id: '2', name: 'laranjas' }),
            new SelfColorFamily({ id: '3', name: 'amarelos' }),
            new SelfColorFamily({ id: '4', name: 'verdes' }),
            new SelfColorFamily({ id: '5', name: 'azuis' }),
            new SelfColorFamily({ id: '10', name: 'violetas' }),
            new SelfColorFamily({ id: '7', name: 'marrons-e-neutros' }),
        ];

    }

    ngOnInit() {
        this.families.forEach(family => {
            this.service.getColors(family)
                .then(colors => {
                    family.colors = colors;
                    this.colors = this.colors.concat(colors);
                })
                .catch(error => console.log(error));
        });
    }

    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.colorsLoaded) {
                $('[data-toggle="popover"]').popover();
                this.colorsLoaded = false;
            }
        }
    }

    isFamilySelected(family: SelfColorFamily): boolean {
        if (this.familySelected && this.familySelected.id == family.id)
            return true;
        else return false;
    }

    selectFamily(family: SelfColorFamily, event = null) {
        if (event)
            event.preventDefault();

        if (this.isFamilySelected(family))
            this.familySelected = null;
        else
            this.familySelected = family;
    }

    selectColor(color: SelfColor, event = null) {
        if (event)
            event.preventDefault();

        this.colorSelected = color;
        this.colorUpdated.emit(this.colorSelected);
    }

    paintBackground(color: string): string {
        if (/^\S{6}$/.test(color))
            return `#${color}`;
        else
            return `rgb(${color})`;
    }

    colorPopOver(color: SelfColor): string {
        return `<span style="display: inline-block; width: 20px; height: 20px; background-color: ${this.paintBackground(color.hex)}"></span> <strong>Código:</strong> ${color.code}`;
    }

    colorBox(color: SelfColor): string {
        return `<span class="color-block" style="background-color: ${this.paintBackground(color.hex)}"></span> ${color.name} (${color.code})`;
    }

    searchColors(): SelfColor[] {
        this.colorsLoaded = true;
        let colors: SelfColor[] = [];
        if (this.findColor) {
            colors = this.colors.filter(color => (color.name.toLowerCase().indexOf(this.findColor.toLowerCase()) !== -1) || (color.code.toLowerCase().indexOf(this.findColor.toLowerCase()) !== -1));
        }
        else
            colors = this.colors;
        if (this.familySelected)
            return colors.filter(color => color.familyId == this.familySelected.id);
        else return colors;
    }


}
