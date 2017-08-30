import { Component, OnInit } from '@angular/core';
import { AppSettings } from "app/app.settings";
import { Title } from "@angular/platform-browser";

@Component({
    moduleId: module.id,
    selector: 'not-found',
    templateUrl: '../../views/404.component.html',
})
export class NotFoundComponent implements OnInit {
    constructor(private titleService: Title) { }

    ngOnInit() {
        AppSettings.setTitle('Página não encontrada', this.titleService);
     }
}