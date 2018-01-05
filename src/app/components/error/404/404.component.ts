import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";

@Component({
    moduleId: module.id,
    selector: 'app-not-found',
    templateUrl: '../../../template/error/404/404.html',
    styleUrls: ['../../../template/error/404/404.scss'],
})
export class NotFoundComponent implements OnInit {
    constructor(private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle('Página não encontrada');
    }
}