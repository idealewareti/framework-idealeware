import { Component, Input } from '@angular/core';

@Component({
    selector: 'wait-loader',
    templateUrl: '../../../templates/shared/wait-loader/wait-loader.html',
    styleUrls: ['../../../templates/shared/wait-loader/wait-loader.scss']
})
export class WaitLoaderComponent {
    @Input() small: boolean = false;
}