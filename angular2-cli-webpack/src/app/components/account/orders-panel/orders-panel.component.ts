import { Component, Input, OnInit } from '@angular/core';
import { OrderService } from "app/services/order.service";
import { Order } from "app/models/order/order";
import { OrderStatusEnum } from "app/enums/order-status.enum";
import { AppSettings } from "app/app.settings";
import { Title } from "@angular/platform-browser";

@Component({
    moduleId: module.id,
    selector: 'order-panel',
    templateUrl: '../../../views/orders-panel.component.html'
})
export class OrderPanelComponent{
    @Input() tabId: string;
    orders: Order[] = [];
    
    constructor(private service: OrderService, private titleService: Title){
        
    }

    ngOnInit(){
        this.service.getOrders()
        .then(orders => {
            this.orders = orders;
        })
        .catch(error => console.log(error));
        
        AppSettings.setTitle('Meus Pedidos', this.titleService);
    }

    showList(){
        if(this.tabId) return false;
        else return true;
    }

    statusClass(order: Order): string{
        if(order.status == OrderStatusEnum.CanceledOrder)
            return 'status-red';
        else if(order.status == OrderStatusEnum.PendingOrder)
            return 'status-yellow';
        else return 'status-green';

    }
}