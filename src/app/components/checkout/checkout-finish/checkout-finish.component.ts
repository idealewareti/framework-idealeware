import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Order } from "../../../models/order/order";
import { OrderService } from "../../../services/order.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Token } from '../../../models/customer/token';
import { isPlatformBrowser } from '@angular/common';

declare var $: any;
declare var gtag: any;

@Component({
    moduleId: module.id,
    selector: 'app-checkout-finish',
    templateUrl: '../../../template/checkout/checkout-finish/checkout-finish.html',
    styleUrls: ['../../../template/checkout/checkout-finish/checkout-finish.scss']
})
export class CheckoutFinishComponent implements OnInit {
    order: Order = new Order();
    constructor(
        private service: OrderService,
        private route: ActivatedRoute,
        private parentRouter: Router,
        private titleService: Title,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.route.params
                .map(params => params)
                .subscribe((params) => {
                    let id = params['id'];
                    this.titleService.setTitle('Seu Pedido Foi Gerado');

                    this.service.getOrder(id, this.getToken())
                        .subscribe(order => {
                            this.order = order;
                            this.sendGoogleEcommerce(order);
                        }, error => {
                            console.log(error);
                            this.parentRouter.navigateByUrl('/');
                        })

                });
        }
    }

    isBankSlip(): boolean {
        let check = false;
        this.order.payment.paymentMethods.forEach(m => {
            if (m.type == 2)
                check = true;
        });
        return check;
    }

    getBankSlipUrl(): string {
        let url = this.order.payment.paymentMethods.filter(m => m.type == 2)[0].bankSlipUrl;
        return url;
    }

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

    private sendGoogleEcommerce(order: Order) {

        gtag('require', 'ecommerce');

        var items = [];

        order.products.forEach((product, index) => {
            items.push(
                {
                    "id": product.sku.code,
                    "name": product.name,
                    "list_position": index,
                    "quantity": product.quantity,
                    "price": product.totalUnitPrice
                }
            );
        });

        gtag('event', 'purchase', {
            "transaction_id": order.orderNumber,
            "affiliation": order.domain,
            "value": order.orderPrice,
            "currency": "BRL",
            "shipping": order.totalFreightPrice,
            "items": items
        });
    }

}