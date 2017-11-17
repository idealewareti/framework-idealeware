import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'app-custom-paint',
    template: `<router-outlet></router-outlet>`,
})
export class CustomPaintComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}