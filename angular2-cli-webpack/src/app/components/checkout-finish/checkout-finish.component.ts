import { Component, OnInit } from '@angular/core';
import { Order } from "app/models/order/order";
import { OrderService } from "app/services/order.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppSettings } from "app/app.settings";

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'checkout-finish',
    templateUrl: '../../views/checkout-finish.component.html',
})
export class CheckoutFinishComponent implements OnInit {
    order: Order = new Order();

    constructor(
        private service: OrderService,
        private route:ActivatedRoute,
        private parentRouter: Router, 
        private titleService: Title,
    ) { }

    ngOnInit() {
         this.route.params
        .map(params => params)
        .subscribe((params) => {
            let id = params['id'];
            AppSettings.setTitle('Seu Pedido Foi Gerado', this.titleService);

            this.service.getOrder(id)
            .then(order => {
                this.order = order;
            })
            .catch(error => {
                console.log(error);
                this.parentRouter.navigateByUrl('/');
            })

        });
     }

    isBankSlip(): boolean{
        let check = false;
        this.order.payment.paymentMethods.forEach(m => {
            if(m.type == 2)
                check = true;
        });
        return check;
    }

    getBankSlipUrl(): string{
        let url = this.order.payment.paymentMethods.filter(m => m.type == 2)[0].bankSlipUrl;
        return url;
    }
    
}