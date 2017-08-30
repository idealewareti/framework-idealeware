import { Component, OnInit, Input } from '@angular/core';
import { Customer } from "app/models/customer/customer";
import { Store } from "app/models/store/store";
import { StoreService } from "app/services/store.service";
import { Router } from "@angular/router";
import { CustomerService } from "app/services/customer.service";
import { Order } from "app/models/order/order";
import { Title } from "@angular/platform-browser";
import { AppSettings } from "app/app.settings";

@Component({
    selector: 'home-panel',
    templateUrl: '../../../views/account-home.component.html',
})
export class AccountHomeComponent implements OnInit {
    customer: Customer = new Customer();
    store: Store;
    public lastOrder: Order = null;
    private logged: boolean;
    
    constructor(
        private service: CustomerService,
        private storeService: StoreService,
        private parentRouter: Router,
        titleService: Title
    ) {
        AppSettings.setTitle('Minha Conta', titleService);
     }

    ngOnInit() {
        this.getStore()
        .then(store => {
            return this.getCustomer();
        })
        .catch(error => {
            this.parentRouter.navigateByUrl('/login');
        })
     }

     getCustomer() : Promise<Customer>{
        return new Promise((resolve, reject) => {
            if(this.logged) {
                resolve(this.customer);
            }
            else{
                this.service.getUser()
                .then(customer => {
                    this.customer = customer;
                    this.logged = true;
                    resolve(customer)
                })
                .catch((error) => {
                    this.logged = false;
                    reject(error);
                });
            }
        });
    }

    isLogged(){
        return this.logged;
    }

    getStore():Promise<Store> {
        return new Promise((resolve, reject) => {
            if(this.store)
                resolve(this.store);
            this.storeService.getInfo()
                .then(store => {
                    this.store = store;
                    resolve(store);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });

    }
}