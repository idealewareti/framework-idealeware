import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Order } from "../../../models/order/order";
import { OrderStatusEnum } from "../../../enums/order-status.enum";
import { OrderManager } from '../../../managers/order.manager';
import { Router } from '@angular/router';

declare var swal: any;

@Component({
    selector: 'order-panel',
    templateUrl: '../../../templates/account/orders-panel/orders-panel.html',
    styleUrls: ['../../../templates/account/orders-panel/orders-panel.scss']
})
export class OrderPanelComponent {
    @Input() tabId: string;
    orders: Order[] = [];

    constructor(
        private orderManager: OrderManager,
        private parentRouter: Router,
        @Inject(PLATFORM_ID) private platformId: Object) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.orderManager.getOrders()
                .subscribe(orders => {
                    this.orders = orders;
                    this.orders.forEach((order) => {
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
                        order.labelStatus = labels.filter(s => s.id == order.status)[0].label;
                    })
                }, error => {
                    swal('Erro', 'Não foi possível obter os pedidos', 'error')
                        .then(() => this.parentRouter.navigateByUrl('/'));
                    throw new Error(`${error.error} Status: ${error.status}`);
                });
        }
    }

    showList() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.tabId) return false;
            else return true;
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