import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'custom-paint',
    template: `<router-outlet></router-outlet>`,
})
export class CustomPaintComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}