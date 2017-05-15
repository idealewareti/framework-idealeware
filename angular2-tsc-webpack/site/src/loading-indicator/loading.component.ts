import { Component, Input, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'loading-indicator',
    templateUrl: '/views/loading.component.html',
    styleUrls: ['/styles/loading.component.css']
})
export class LoadingIndicatorComponent implements OnInit {
    @Input() loading: boolean;
    @Input() absolute: boolean = true;
    private position: string;
    
    constructor() { }

    ngOnInit() {
        if(this.absolute){
            this.position = 'absolute';
        }
        else this.position = 'relative';
     }
}