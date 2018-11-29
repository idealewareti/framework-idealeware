import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Customer } from "../../../models/customer/customer";
import { Store } from "../../../models/store/store";
import { Order } from "../../../models/order/order";
import { StoreManager } from '../../../managers/store.manager';
import { OrderStatusEnum } from '../../../enums/order-status.enum';
import { OrderManager } from '../../../managers/order.manager';
import { CustomerManager } from '../../../managers/customer.manager';
import { Router } from '@angular/router';

declare var swal: any;


@Component({
    selector: 'home-panel',
    templateUrl: '../../../templates/account/account-home/account-home.html',
    styleUrls: ['../../../templates/account/account-home/account-home.scss']
})

export class AccountHomeComponent implements OnInit {
    customer: Customer = new Customer();
    store: Store;
    lastOrder: Order = null;
    private logged: boolean;



    constructor(
        private customerManager: CustomerManager,
        private orderManager: OrderManager,
        private storeManager: StoreManager,
        private parentRouter: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.getStore()
                .then(() => {
                    this.orderManager.getOrders()
                        .subscribe(orders => {
                            this.lastOrder = orders[0];
                            const labels = [
                                { id: 0, label: 'Novo Pedido' },
                                { id: 1, label: 'Pedido Aprovado' },
                                { id: 2, label: 'Em Transporte' },
                                { id: 3, label: 'Pedido Concluído' },
                                { id: 10, label: 'Pedido Faturado' },
                                { id: 11, label: 'Pendente' },
                                { id: 12, label: 'Pedido Cancelado' },
                                { id: 13, label: 'Em Processamento' }
                            ]
                            this.lastOrder.labelStatus = labels.filter(s => s.id == this.lastOrder.status)[0].label;
                        }, error => {
                            throw new Error(`${error.error} Status: ${error.status}`);
                        });
                    return this.getCustomer();
                });
        }
    }

    getCustomer(): Promise<Customer> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise((resolve, reject) => {
                if (this.logged) {
                    resolve(this.customer);
                }
                else {
                    this.customerManager.getUser()
                        .subscribe(customer => {
                            this.customer = customer;
                            this.logged = true;
                            resolve(customer)
                        }, err => {
                            swal('Erro', 'Falha ao carregar o usuário', 'error')
                                .then(() => this.parentRouter.navigateByUrl('/'));
                            throw new Error(`${err.error} Status: ${err.status}`);
                        }), (error) => {
                            this.logged = false;
                            reject(error);
                        };
                }
            });
        }
    }

    isLogged() {
        if (isPlatformBrowser(this.platformId)) {
            return this.logged;
        }
    }

    getStore(): Promise<Store> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise((resolve, reject) => {
                if (this.store)
                    resolve(this.store);

                this.storeManager.getStore()
                    .subscribe(store => {
                        this.store = store;
                        resolve(store);
                    }, error => {
                        reject(error);
                    });
            });
        }
    }

    statusClass(order: Order): string {
        if (isPlatformBrowser(this.platformId)) {
            if (order.status == OrderStatusEnum.CanceledOrder)
                return 'status-red';
            else if (order.status == OrderStatusEnum.PendingOrder)
                return 'status-yellow';
            else return 'status-green';
        }
    }
}