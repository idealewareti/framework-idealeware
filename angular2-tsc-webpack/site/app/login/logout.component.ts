import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import {CustomerService} from '../_services/customer.service';

@Component({
    moduleId: module.id,
    selector: 'logout',
    templateUrl: '/views/logout.component.html',
})
export class LogoutComponent implements OnInit {
    
    constructor(private service: CustomerService) {
     }

    ngOnInit() {
        this.logoff();
     }

     logoff(){
        if(this.service.hasToken()){
            this.service.logout();
        }
     }
}