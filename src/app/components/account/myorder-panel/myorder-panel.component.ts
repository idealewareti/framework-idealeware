import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from "@angular/router";
import { Order } from "../../../models/order/order";
import { OrderStatusEnum } from "../../../enums/order-status.enum";
import { Store } from '../../../models/store/store';
import { StoreManager } from '../../../managers/store.manager';
import { OrderManager } from '../../../managers/order.manager';

declare var swal: any;

@Component({
    selector: 'myorder-panel',
    templateUrl: '../../../templates/account/myorder-panel/myorder-panel.html',
    styleUrls: ['../../../templates/account/myorder-panel/myorder-panel.scss'],
})
export class MyOrderPanelComponent implements OnInit {
    @Input() tabId: string;
    order: Order = null;
    mediaPath: string;
    store: Store;

    constructor(
        private route: ActivatedRoute,
        private orderManager: OrderManager,
        private storeManager: StoreManager,
        private parentRouter: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.tabId = this.route.params['value'].id;
            this.getStore()
                .then(store => {
                    this.store = store;
                    this.mediaPath = `${this.store.link}/static/products/`;
                    return this.getOrder(this.tabId);
                })
                .then(order => {
                    this.order = order;
                })
                .catch(error => {
                    swal('Erro ao exibir o pedido', error.text(), 'error');
                    this.parentRouter.navigateByUrl('/conta/pedidos');
                });
        }
    }

    getOrder(orderId: string): Promise<Order> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise((resolve, reject) => {
                this.orderManager.getOrder(orderId)
                    .subscribe(order => {
                        resolve(order);
                    }), (error => {
                        reject(error);
                    })
            });
        }
    }

    isNewOrder(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.order.historyStatus.find(a => a.status == OrderStatusEnum.NewOrder) != null)
                return true;
            return false;
        }
    }

    newOrderDate(): Date {
        if (isPlatformBrowser(this.platformId)) {
            return this.order.historyStatus.find(a => a.status == OrderStatusEnum.NewOrder).alterDate
        }
    }

    isAprovedOrder(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.order.historyStatus.find(a => a.status == OrderStatusEnum.ApprovedOrder) != null)
                return true;
            return false;
        }
    }

    aprovedOrderDate(): Date {
        if (isPlatformBrowser(this.platformId)) {
            return this.order.historyStatus.find(a => a.status == OrderStatusEnum.ApprovedOrder).alterDate
        }
    }

    isTransportedOrder(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.order.historyStatus.find(a => a.status == OrderStatusEnum.TransportedOrder) != null)
                return true;
            return false;
        }
    }

    transportedOrderDate(): Date {
        if (isPlatformBrowser(this.platformId)) {
            return this.order.historyStatus.find(a => a.status == OrderStatusEnum.TransportedOrder).alterDate
        }
    }

    isFaturedOrder(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.order.historyStatus.find(a => a.status == OrderStatusEnum.FaturedOrder) != null)
                return true;
            return false;
        }
    }

    faturedOrderDate(): Date {
        if (isPlatformBrowser(this.platformId)) {
            return this.order.historyStatus.find(a => a.status == OrderStatusEnum.TransportedOrder).alterDate
        }
    }

    isFinishOrder(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.order.historyStatus.find(a => a.status == OrderStatusEnum.FinishedOrder) != null)
                return true;
            return false;
        }
    }

    finishedOrderDate(): Date {
        if (isPlatformBrowser(this.platformId)) {
            return this.order.historyStatus.find(a => a.status == OrderStatusEnum.FinishedOrder).alterDate
        }
    }


    isCanceledOrder(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.order.historyStatus.find(a => a.status == OrderStatusEnum.CanceledOrder) != null)
                return true;
            return false;
        }
    }

    canceledOrderDate(): Date {
        if (isPlatformBrowser(this.platformId)) {
            return this.order.historyStatus.find(a => a.status == OrderStatusEnum.CanceledOrder).alterDate
        }
    }

    isCreditCard(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.order.payment.paymentMethods.length > 0 && this.order.payment.paymentMethods[0].type == 1)
                return true;
            else return false;
        }
    }

    isBankSlip(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.order.payment.paymentMethods.length > 0 && this.order.payment.paymentMethods[0].type == 2)
                return true;
            else return false;
        }
    }

    isHiddenVariation(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            let type = this.store.settings.find(s => s.type == 4);
            if (type)
                return type.status;
            else
                return false;
        }
    }

    getDiscount() {
        if (isPlatformBrowser(this.platformId)) {
            return this.order.totalDiscountPrice;
        }
    }

    getShipping() {
        if (isPlatformBrowser(this.platformId)) {
            return this.order.totalFreightPrice;
        }
    }

    getSubTotal() {
        if (isPlatformBrowser(this.platformId)) {
            return this.order.totalProductsPrice + this.order.totalServicePrice;
        }
    }

    getTotal() {
        if (isPlatformBrowser(this.platformId)) {
            return this.order.orderPrice;
        }
    }

    getTotalServices(): number {
        if (isPlatformBrowser(this.platformId)) {
            return this.order.totalServicePrice;
        }
    }

    getTotalProducts(): number {
        if (isPlatformBrowser(this.platformId)) {
            return this.order.totalProductsPrice
        }
    }

    getNumItemsInCart() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.order) {
                let numItems = 0;
                numItems += (this.order.products) ? this.order.products.length : 0;
                numItems += (this.order.services) ? this.order.services.length : 0;

                return numItems;
            }
            else return 0;
        }
    }

    private getStore(): Promise<Store> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise((resolve, reject) => {
                this.storeManager.getStore()
                    .subscribe(store => {
                        resolve(store);
                    }, error => {
                        reject(error);
                    });
            });
        }
    }
}