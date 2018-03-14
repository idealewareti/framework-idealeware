import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { Customer } from "../../../models/customer/customer";
import { Store } from "../../../models/store/store";
import { Router } from "@angular/router";
import { CustomerService } from "../../../services/customer.service";
import { Order } from "../../../models/order/order";
import { Title } from "@angular/platform-browser";
import { Token } from '../../../models/customer/token';
import { isPlatformBrowser } from '@angular/common';
import { StoreManager } from '../../../managers/store.manager';

@Component({
    selector: 'app-home-panel',
    templateUrl: '../../../template/account/account-home/account-home.html',
    styleUrls: ['../../../template/account/account-home/account-home.scss']
})
export class AccountHomeComponent implements OnInit {
    customer: Customer = new Customer();
    store: Store;
    public lastOrder: Order = null;
    private logged: boolean;

    constructor(
        private service: CustomerService,
        private storeManager: StoreManager,
        private parentRouter: Router,
        titleService: Title,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        titleService.setTitle('Minha Conta');
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

    private getToken(): Token {
        let token = new Token();
        if (isPlatformBrowser(this.platformId)) {
            token = new Token();
            token.accessToken = localStorage.getItem('auth');
            token.createdDate = new Date(localStorage.getItem('auth_create'));
            token.expiresIn = Number(localStorage.getItem('auth_expires'));
            token.tokenType = 'Bearer';
        }
        return token;
    }

    getCustomer(): Promise<Customer> {
        return new Promise((resolve, reject) => {
            if (this.logged) {
                resolve(this.customer);
            }
            else {
                let token: Token = this.getToken();
                this.service.getUser(token)
                    .subscribe(customer => {
                        this.customer = customer;
                        this.logged = true;
                        resolve(customer)
                    }), (error) => {
                        this.logged = false;
                        reject(error);
                    };
            }
        });
    }

    isLogged() {
        return this.logged;
    }

    getStore(): Promise<Store> {
        return new Promise((resolve, reject) => {
            if (this.store)
                resolve(this.store);

            this.storeManager.getStore()
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