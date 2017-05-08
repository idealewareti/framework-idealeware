import {Component, Input, OnInit, AfterViewChecked, AfterContentChecked} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import {Location} from '@angular/common';
import {Http} from '@angular/http';
import {AppSettings} from '../app.settings';
import {Customer} from '../_models/customer/customer';
import {Store} from '../_models/store/store';
import {CustomerService} from '../_services/customer.service';
import {StoreService} from '../_services/store.service';

@Component({
    moduleId: module.id,
    selector: 'store-header',
    templateUrl: '/views/myheader.component.html'
})
export class MyHeaderComponent implements OnInit {

    private path: string;
    public readonly mediaPath = `${AppSettings.MEDIA_PATH}/store`;
    customer: Customer;
    @Input() store: Store;
    private logged: boolean;
    
    constructor(
        private service: CustomerService,
        private route:ActivatedRoute, 
        private parentRouter: Router,
        private location:Location
    ){
    }
    
    ngOnInit() {
        this.path = this.parentRouter.url;
        this.getUrl();
        
    }

    ngAfterContentChecked() {
        this.getUrl();
        this.getCustomer();
    }

    private getUrl(){
        this.parentRouter.events.subscribe((url:any) => this.path = url['url']);
    }

    public isLoggedIn(){
        return this.logged;
    }

    public isCheckout() : boolean{
        if(!this.path) return false
        else if(this.path.split('/')[1] == 'checkout') return true;
        else if(this.path.split('/')[1] == 'orcamento') return true;
        else return false;
    }

    public isMobile(): boolean{
        return AppSettings.isMobile();
    }

    private getCustomer(){
        if(this.service.hasToken() && !this.customer){
            this.service.getUserFromStorage()
            .then(user => {
                this.customer = user;
                this.logged = true;
            })
            .catch(() => {
                this.customer = null;
                this.logged = false;
            });
        }
        else if(!this.service.hasToken()){
            this.customer = null;
            this.logged = false;
        }
    }
}