import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from "app/services/order.service";
import { Order } from "app/models/order/order";
import { AppSettings } from "app/app.settings";
import { OrderStatusEnum } from "app/enums/order-status.enum";

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'myorder-panel',
    templateUrl: '../../views/myorder-panel.component.html',
})
export class MyOrderPanelComponent implements OnInit {
    @Input() tabId: string;
    order: Order = null;
    readonly mediaPath = `${AppSettings.MEDIA_PATH}/products/`;

    constructor(
        private route:ActivatedRoute, 
        private service: OrderService, 
        private parentRouter: Router,) { }

    ngOnInit() {
        window.scrollTo(0, 0); // por causa das hash url
        this.tabId = this.route.params['value'].id;
        this.service.getOrder(this.tabId)
        .then(order => this.order = order)
        .catch(error => {
            console.log(error);
            swal({
                title: 'Erro ao exibir o pedido',
                text: error._body,
                type: 'error',
                confirmButtonText: 'OK'
            });
            this.parentRouter.navigateByUrl('/conta/pedidos');
        })
     }

     public orderPipeline(){
         if(this.order.status == OrderStatusEnum.NewOrder || this.order.status == OrderStatusEnum.PendingOrder)
            return 1;
        else if(this.order.status == OrderStatusEnum.ApprovedOrder || this.order.status == OrderStatusEnum.FaturedOrder || this.order.status == OrderStatusEnum.ProcessOrder)
            return 2;
        else if(this.order.status == OrderStatusEnum.TransportedOrder)
            return 3;
        else if(this.order.status == OrderStatusEnum.FinishedOrder)
            return 5;
        else return 0;
     }
}