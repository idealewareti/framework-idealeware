import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import {CustomerService} from 'app/services/customer.service';
import { AppSettings } from "app/app.settings";
import { Title } from "@angular/platform-browser";

@Component({
    moduleId: module.id,
    selector: 'logout',
    templateUrl: '../../views/logout.component.html',
})
export class LogoutComponent implements OnInit {
    
    constructor(
        private service: CustomerService,
        private titleService: Title
    ) {
    }

    ngOnInit() {
        AppSettings.setTitle('Saindo do sistema...', this.titleService);
        this.logoff();
     }

     logoff(){
        if(this.service.hasToken()){
            this.service.logout();
            AppSettings.setTitle('Deslogado do sistema.', this.titleService);
        }
     }
}