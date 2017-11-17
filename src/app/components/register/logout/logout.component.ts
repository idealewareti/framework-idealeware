import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { CustomerManager } from '../../../managers/customer.manager';

@Component({
    moduleId: module.id,
    selector: 'app-logout',
    templateUrl: '../../../template/register/logout/logout.html',
    styleUrls: ['../../../template/register/logout/logout.scss']
})
export class LogoutComponent implements OnInit {
    
    constructor(private manager: CustomerManager, private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle('Saindo do sistema...');
        this.logoff();
     }

     logoff(){
        if(this.manager.hasToken()){
            this.manager.logOff();
            this.titleService.setTitle('Deslogado do sistema.');
        }
     }
}