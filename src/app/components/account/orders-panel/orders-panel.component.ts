import { Component, Input, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { OrderService } from "../../../services/order.service";
import { Order } from "../../../models/order/order";
import { OrderStatusEnum } from "../../../enums/order-status.enum";
import { Title } from "@angular/platform-browser";
import { isPlatformBrowser } from '@angular/common';
import { Token } from '../../../models/customer/token';

@Component({
    moduleId: module.id,
    selector: 'app-order-panel',
    templateUrl: '../../../template/account/orders-panel/orders-panel.html',
    styleUrls: ['../../../template/account/orders-panel/orders-panel.scss']
})
export class OrderPanelComponent {
    @Input() tabId: string;
    orders: Order[] = [];

    constructor(private service: OrderService, private titleService: Title, @Inject(PLATFORM_ID) private platformId: Object) {}

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

    ngOnInit() {
        this.service.getOrders(this.getToken())
            .subscribe(orders => {
                this.orders = orders;
            }), (error => console.log(error));

        this.titleService.setTitle('Meus Pedidos');
    }

    showList() {
        if (this.tabId) return false;
        else return true;
    }

    statusClass(order: Order): string {
        if (order.status == OrderStatusEnum.CanceledOrder)
            return 'status-red';
        else if (order.status == OrderStatusEnum.PendingOrder)
            return 'status-yellow';
        else return 'status-green';

    }
}