import { Component, OnInit, Inject, PLATFORM_ID  } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { isPlatformBrowser } from '@angular/common';
import { ServerResponseService } from "../../../services/server-response.service";

@Component({
    moduleId: module.id,
    selector: 'app-not-found',
    templateUrl: '../../../template/error/404/404.html',
    styleUrls: ['../../../template/error/404/404.scss'],
})
export class NotFoundComponent implements OnInit {
    constructor(
	private titleService: Title,
    private serviceResponse: ServerResponseService,
    @Inject(PLATFORM_ID) private platformId: Object	
	) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
        this.titleService.setTitle('Página não encontrada');
        this.serviceResponse.setStatus(404,'not found');
        }
    }
}