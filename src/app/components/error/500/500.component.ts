import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-error-500',
    templateUrl: '../../../template/error/500/500.html',
    styleUrls: ['../../../template/error/500/500.scss'],
})
export class Error500Component implements OnInit {
    constructor(private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle('Erro');
    }
}