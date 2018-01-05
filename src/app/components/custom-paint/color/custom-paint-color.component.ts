import { Component, OnInit, AfterViewChecked, PLATFORM_ID, Inject } from '@angular/core';
import { CustomPaintColor } from "../../../models/custom-paint/custom-paint-color";
import { CustomPaintService } from "../../../services/custom-paint.service";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomPaintManufacturer } from "../../../models/custom-paint/custom-paint-manufacturer";
import { CustomPaintFamily } from "../../../models/custom-paint/custom-paint-family";
import { isPlatformBrowser } from '@angular/common';

declare var $: any;
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'app-custom-paint-color',
    templateUrl: '../../../template/custom-paint/custom-paint-color/custom-paint-color.html',
    styleUrls: ['../../../template/custom-paint/custom-paint-color/custom-paint-color.scss']
})
export class CustomPaintColorComponent implements OnInit {
    private colorsLoaded: boolean = false;
    families: CustomPaintFamily[] = [];
    colors: CustomPaintColor[] = []
    manufacuterId: string;
    manufacturer: CustomPaintManufacturer = new CustomPaintManufacturer();
    findColor: string = null;
    colorSelected: CustomPaintColor = null;
    familySelected: CustomPaintFamily = null;

    constructor(
        private service: CustomPaintService,
        private titleService: Title,
        private route: ActivatedRoute,
        private parentRouter: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.route.params
            .map(params => params)
            .subscribe((params) => {
                this.manufacuterId = params['manufacturer'];
                this.getColors(this.manufacuterId);
                this.getManufacturer(this.manufacuterId);
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

    nextStep(event = null): any {
        if (isPlatformBrowser(this.platformId)) {
            if (event)
                event.preventDefault();

            if (!this.colorSelected) {
                swal('Erro', 'Nenhuma cor selecionada', 'error');
                return;
            }
            else {
                let url: string = `/corespersonalizadas/${this.manufacturer.manufacturer}/${this.colorSelected.code}`;
                this.parentRouter.navigateByUrl(url);
            }
        }
    }

    /* Loaders */
    getColors(manufacuter: string) {
        if (isPlatformBrowser(this.platformId)) {
            this.service.getColorsFromManufacturer(manufacuter)
                .subscribe(colors => {
                    this.colors = colors;
                    this.colorsLoaded = true;
                    this.getFamilies();
                }, error => {
                    console.log(error);
                    swal(error.text());
                });
        }
    }

    getManufacturer(id: string) {
        this.service.getManufacturers()
            .subscribe(manufacturers => {
                this.manufacturer = manufacturers.filter(m => m.manufacturer === id)[0];
                this.titleService.setTitle(`Cores Personalizadas ${this.manufacturer.name} -Selecione a cor`);

            }, error => console.log(error));
    }

    getFamilies() {
        let unique: CustomPaintColor[] = []
        this.colors.forEach(c => { if (unique.findIndex(u => u.familyName === c.familyName) == -1) unique.push(c); })
        if (unique.length > 0) {
            unique.forEach(u => {
                this.families.push(new CustomPaintFamily({ name: u.familyName, code: u.familyCode, position: u.familyPosition }));
            });
        }
    }

    /* Helpers */
    paintBackground(color: string): string {
        if (/^\S{6}$/.test(color))
            return `#${color}`;
        else
            return `rgb(${color})`;
    }

    colorPopOver(color: CustomPaintColor): string {
        return `<span style="display: inline-block; width: 20px; height: 20px; background-color: ${this.paintBackground(color.rgb)}"></span> <strong>Código:</strong> ${color.code}`;
    }

    colorBox(color: CustomPaintColor): string {
        return `<span class="color-block" style="background-color: ${this.paintBackground(color.rgb)}"></span> ${color.name} (${color.code})`;
    }

    isFamilySelected(family: CustomPaintFamily): boolean {
        if (this.familySelected && this.familySelected.code == family.code)
            return true;
        else return false;
    }

    /* Filters */
    searchColors(): CustomPaintColor[] {
        this.colorsLoaded = true;
        let colors: CustomPaintColor[] = [];
        if (this.findColor)
            colors = this.colors.filter(color => (color.name.toLowerCase().indexOf(this.findColor.toLowerCase()) !== -1) || (color.code.toLowerCase().indexOf(this.findColor.toLowerCase()) !== -1));
        else
            colors = this.colors;
        if (this.familySelected)
            return colors.filter(color => color.familyCode == this.familySelected.code);
        else return colors;
    }

    /* Handlers */
    selectColor(color: CustomPaintColor, event = null) {
        if (event)
            event.preventDefault();

        this.colorSelected = color;
    }

    selectFamily(family: CustomPaintFamily, event = null) {
        if (event)
            event.preventDefault();

        if (this.isFamilySelected(family))
            this.familySelected = null;
        else
            this.familySelected = family;
    }

}