import { Component, Input, OnInit } from '@angular/core';
import { OrderService } from "../../_services/order.service";
import { Order } from "../../_models/order/order";

@Component({
    moduleId: module.id,
    selector: 'order-panel',
    templateUrl: '/views/orders-panel.component.html'
})
export class OrderPanelComponent{
    @Input() tabId: string;
    orders: Order[] = [];
    
    constructor(private service: OrderService){

    }

    ngOnInit(){
        this.service.getOrders()
        .then(orders => this.orders = orders)
        .catch(error => console.log(error));
    }

    private showList(){
        if(this.tabId) return false;
        else return true;
    }
}