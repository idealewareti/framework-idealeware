import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'wait-loader',
    templateUrl: '../../views/wait-loader.component.html',
    styleUrls: ['../../styles/wait-loader.component.css']
})
export class WaitLoaderComponent implements OnInit {
    @Input() small: boolean = false;
    
    constructor() { }

    ngOnInit() { }
}