import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-wait-loader',
    templateUrl: '../../../template/shared/wait-loader/wait-loader.html',
    styleUrls: ['../../../template/shared/wait-loader/wait-loader.scss']
})
export class WaitLoaderComponent implements OnInit {
    @Input() small: boolean = false;

    constructor() { }

    ngOnInit() { }
}