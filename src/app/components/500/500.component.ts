import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppSettings } from 'app/app.settings';

@Component({
    selector: 'error-500',
    templateUrl: '../../views/500.component.html',
})
export class Error500Component implements OnInit {
    constructor(private titleService: Title) { }

    ngOnInit() {
        AppSettings.setTitle('Erro', this.titleService);
    }
}