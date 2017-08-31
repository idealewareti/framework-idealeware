import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from "app/services/order.service";
import { Order } from "app/models/order/order";
import { AppSettings } from "app/app.settings";
import { OrderStatusEnum } from "app/enums/order-status.enum";
import { Title } from "@angular/platform-browser";
import { Globals } from "app/models/globals";

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'myorder-panel',
    templateUrl: '../../../views/myorder-panel.component.html',
})
export class MyOrderPanelComponent implements OnInit {
    @Input() tabId: string;
    order: Order = null;
    mediaPath: string;
    mediaPathPaint: string;

    constructor(
        private route:ActivatedRoute, 
        private service: OrderService, 
        private parentRouter: Router,
        private titleService: Title,
        private globals: Globals
    ) { }

    ngOnInit() {
        window.scrollTo(0, 0); // por causa das hash url
        this.mediaPath = `${this.globals.store.link}/static/products/`;
        this.mediaPathPaint = `${this.globals.store.link}/static/custompaint/`;

        this.tabId = this.route.params['value'].id;
        this.service.getOrder(this.tabId)
        .then(order => {
            this.order = order;
            AppSettings.setTitle(`Pedido #${this.order.orderNumber}`, this.titleService);
        })
        .catch(error => {
            console.log(error);
            swal({
                title: 'Erro ao exibir o pedido',
                text: error.text(),
                type: 'error',
                confirmButtonText: 'OK'
            });
            this.parentRouter.navigateByUrl('/conta/pedidos');
        })
     }

     orderPipeline(){
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

     isCreditCard(): boolean{
        if(this.order.payment.paymentMethods.length > 0 && this.order.payment.paymentMethods[0].type == 1)
            return true;
        else return false;
     }

     isBankSlip(): boolean{
        if(this.order.payment.paymentMethods.length > 0 && this.order.payment.paymentMethods[0].type == 2)
            return true;
        else return false;
     }

     getDiscount() {
        return this.order.totalDiscountPrice;
    }

    getShipping() {
        return this.order.totalFreightPrice;
    }

    getSubTotal() {
        return this.order.totalProductsPrice + this.order.totalServicePrice + this.order.totalPaintsPrice;
    }

    getTotal() {
        return this.order.orderPrice;
    }

    getTotalServices(): number {
        return this.order.totalServicePrice;
    }

    getTotalProducts(): number{
        return this.order.totalProductsPrice
    }

    getTotalPaints(): number{
        return this.order.totalPaintsPrice;
    }

    getNumItemsInCart() {
        if(this.order){
            let numItems = 0;
            numItems += (this.order.products) ? this.order.products.length : 0;
            numItems += (this.order.services) ? this.order.services.length : 0;
            numItems += (this.order.paints) ? this.order.paints.length : 0;
            
            return  numItems;
        }
        else return 0;
    }
}