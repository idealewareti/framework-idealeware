import {Component, Input, Output, EventEmitter, AfterViewChecked, AfterContentChecked, OnInit} from '@angular/core';
import {HttpClient} from '../httpclient'
import {AppSettings} from '../app.settings'
import {Http} from '@angular/http';
import {Paleta} from '../_models/selfColor/paleta'
import { SelfColor } from '../_models/selfColor/self-color';
import { NgProgressService } from "ngx-progressbar";
import { SelfColorService } from "../_services/self-color.service";
import { SelfColorFamily } from "../_models/selfColor/self-color-family";

@Component({
    moduleId: module.id,
    selector: 'self-color',
    templateUrl: '/views/self-color.component.html'
})
export class SelfColorComponent {
    
    private urlCores: string;
    private families: SelfColorFamily[] = [];

    @Input() selfColor: SelfColor;
    @Output() colorUpdated: EventEmitter<SelfColor> = new EventEmitter<SelfColor>();

    constructor(
        private service: SelfColorService, 
        private loaderService: NgProgressService)
    {

        this.families = [
            new SelfColorFamily({id: '8', name: 'off-whites'}),
            new SelfColorFamily({id: '9', name: 'tons-pastel'}),
            new SelfColorFamily({id: '1', name: 'vermelhos'}),
            new SelfColorFamily({id: '2', name: 'laranjas'}),
            new SelfColorFamily({id: '3', name: 'amarelos'}),
            new SelfColorFamily({id: '4', name: 'verdes'}),
            new SelfColorFamily({id: '5', name: 'azuis'}),
            new SelfColorFamily({id: '10', name: 'violetas'}),
            new SelfColorFamily({id: '7', name: 'marrons-e-neutros'}),
        ];

    }

    ngOnInit() {
        this.families.forEach(family => {
            this.service.getColors(family)
            .then(colors => {
                family.colors = colors;
            })
            .catch(error => console.log(error));
        })
    }

    
}