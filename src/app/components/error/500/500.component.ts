import { Component, OnInit, Inject, PLATFORM_ID  } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-error-500',
    templateUrl: '../../../template/error/500/500.html',
    styleUrls: ['../../../template/error/500/500.scss'],
})
export class Error500Component implements OnInit {
    constructor(private titleService: Title,@Inject(PLATFORM_ID) private platformId: Object	) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
        this.titleService.setTitle('Erro');
        }
    }
}