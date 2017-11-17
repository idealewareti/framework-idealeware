import { Component, OnInit } from '@angular/core';
import { CustomPaintManufacturer } from "../../../models/custom-paint/custom-paint-manufacturer";
import { CustomPaintService } from "../../../services/custom-paint.service";
import { Title } from "@angular/platform-browser";
import { Globals } from '../../../models/globals';

@Component({
    moduleId: module.id,
    selector: 'app-custom-paint-manufacturer',
    templateUrl: '../../../template/custom-paint/custom-paint-manufacturer/custom-paint-manufacturer.html',
    styleUrls: ['../../../template/custom-paint/custom-paint-manufacturer/custom-paint-manufacturer.scss']
})
export class CustomPaintManufacturerComponent implements OnInit {
    manufacturers: CustomPaintManufacturer[] = [];
    mediaPath: string = '';
    
    constructor(
        private service: CustomPaintService, 
        private titleService: Title,
        private globals: Globals
    ) { }

    ngOnInit() {
        this.mediaPath = `${this.globals.store.link}/static/custompaint/`;
        this.titleService.setTitle('Cores Personalizadas');
        this.getManufacturers();
     }

    getManufacturers(){
        this.service.getManufacturers()
        .subscribe(manufacturers => this.manufacturers = manufacturers,
            error => console.log(error));
    }


    getColWidth(): string{
        if(this.manufacturers.length == 1)
            return 'col-md-12 col-sm-12';
        else if(this.manufacturers.length == 2)
            return 'col-md-6 col-sm-12';
        else
            return 'col-md-4 col-sm-12';
    }
}