import {Component, Input, Output, EventEmitter, AfterViewChecked, AfterContentChecked, OnInit} from '@angular/core';
import {HttpClient} from 'app/helpers/httpclient'
import {AppSettings} from 'app/app.settings'
import {Http} from '@angular/http';
import {Paleta} from 'app/models/self-color/paleta'
import { SelfColor } from 'app/models/self-color/self-color';
import { NgProgressService } from "ngx-progressbar";
import { SelfColorService } from "app/services/self-color.service";
import { SelfColorFamily } from "app/models/self-color/self-color-family";

@Component({
    moduleId: module.id,
    selector: 'self-color',
    templateUrl: '../../views/self-color.component.html'
})
export class SelfColorComponent {
    
    urlCores: string;
    families: SelfColorFamily[] = [];

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