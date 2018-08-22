import { Component, Input, OnInit } from '@angular/core';
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
        private parentRouter: Router
    ) { }

    ngOnInit() {
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

    getOrder(orderId: string): Promise<Order> {
        return new Promise((resolve, reject) => {
            this.orderManager.getOrder(orderId)
                .subscribe(order => {
                    resolve(order);
                }), (error => {
                    reject(error);
                })
        });
    }

    isNewOrder(): boolean {
        if (this.order.historyStatus.find(a => a.status == OrderStatusEnum.NewOrder) != null)
            return true;
        return false;
    }

    newOrderDate(): Date{
        return this.order.historyStatus.find(a => a.status == OrderStatusEnum.NewOrder).alterDate
    }

    isAprovedOrder(): boolean {
        if (this.order.historyStatus.find(a => a.status == OrderStatusEnum.ApprovedOrder) != null)
            return true;
        return false;
    }

    aprovedOrderDate(): Date {
        return this.order.historyStatus.find(a => a.status == OrderStatusEnum.ApprovedOrder).alterDate
    }

    isTransportedOrder(): boolean {
        if (this.order.historyStatus.find(a => a.status == OrderStatusEnum.TransportedOrder) != null)
            return true;
        return false;
    }

    transportedOrderDate(): Date {
        return this.order.historyStatus.find(a => a.status == OrderStatusEnum.TransportedOrder).alterDate
    }

    isFaturedOrder(): boolean {
        if (this.order.historyStatus.find(a => a.status == OrderStatusEnum.FaturedOrder) != null)
            return true;
        return false;
    }

    faturedOrderDate():Date{
        return this.order.historyStatus.find(a => a.status == OrderStatusEnum.TransportedOrder).alterDate
    }

    isFinishOrder(): boolean {
        if (this.order.historyStatus.find(a => a.status == OrderStatusEnum.FinishedOrder) != null)
            return true;
        return false;
    }

    finishedOrderDate(): Date{
        return this.order.historyStatus.find(a => a.status == OrderStatusEnum.FinishedOrder).alterDate
    }

    isCanceledOrder(): boolean {
        if (this.order.historyStatus.find(a => a.status == OrderStatusEnum.CanceledOrder) != null)
            return true;
        return false;
    }

    canceledOrderDate():Date{
        return this.order.historyStatus.find(a => a.status == OrderStatusEnum.CanceledOrder).alterDate
    }

    isCreditCard(): boolean {
        if (this.order.payment.paymentMethods.length > 0 && this.order.payment.paymentMethods[0].type == 1)
            return true;
        else return false;
    }

    isBankSlip(): boolean {
        if (this.order.payment.paymentMethods.length > 0 && this.order.payment.paymentMethods[0].type == 2)
            return true;
        else return false;
    }

    isHiddenVariation(): boolean {
        let type = this.store.settings.find(s => s.type == 4);
        if (type)
            return type.status;
        else
            return false;
    }

    getDiscount() {
        return this.order.totalDiscountPrice;
    }

    getShipping() {
        return this.order.totalFreightPrice;
    }

    getSubTotal() {
        return this.order.totalProductsPrice + this.order.totalServicePrice;
    }

    getTotal() {
        return this.order.orderPrice;
    }

    getTotalServices(): number {
        return this.order.totalServicePrice;
    }

    getTotalProducts(): number {
        return this.order.totalProductsPrice
    }

    getNumItemsInCart() {
        if (this.order) {
            let numItems = 0;
            numItems += (this.order.products) ? this.order.products.length : 0;
            numItems += (this.order.services) ? this.order.services.length : 0;

            return numItems;
        }
        else return 0;
    }

    private getStore(): Promise<Store> {
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