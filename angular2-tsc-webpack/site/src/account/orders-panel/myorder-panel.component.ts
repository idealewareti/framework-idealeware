import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from "../../_services/order.service";
import { Order } from "../../_models/order/order";
import { AppSettings } from "../../app.settings";

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'myorder-panel',
    templateUrl: '/views/myorder-panel.component.html',
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
         if(this.order.status == 0 || this.order.status == 5)
            return 1;
        else if(this.order.status == 1 || this.order.status == 4)
            return 2;
        else if(this.order.status == 7)
            return 3;
        else if(this.order.status == 2)
            return 4;
        else if(this.order.status == 3)
            return 5;
        else return 0;
     }
}