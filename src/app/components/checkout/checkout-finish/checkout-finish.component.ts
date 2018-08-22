import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { Order } from "../../../models/order/order";

declare var dataLayer: any;

@Component({
    selector: 'checkout-finish',
    templateUrl: '../../../templates/checkout/checkout-finish/checkout-finish.html',
    styleUrls: ['../../../templates/checkout/checkout-finish/checkout-finish.scss']
})
export class CheckoutFinishComponent implements OnInit {

    order: Order = new Order();

    constructor(
        private activatedRoute: ActivatedRoute,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.order = this.activatedRoute.snapshot.data.order;

        var products = [];

        this.order.products.forEach((product) => {
            products.push(
                {
                    'name': product.name,
                    'id': product.sku.code,
                    'price': product.totalUnitPrice,
                    'variant': product.sku.variations.map(v => v.option.name).join(", "),
                    'quantity': product.quantity
                }
            );
        });

        dataLayer.push({
            'ecommerce': {
                'currencyCode': 'BRL',
                'purchase': {
                    'actionField': {
                        'id': this.order.orderNumber,
                        'affiliation': this.order.domain,
                        'revenue': this.order.orderPrice,
                        'shipping': this.order.totalFreightPrice,
                        'coupon': this.order.coupons.map(c => c.name).join(", ")
                    },
                    'products': products
                }
            }
        });

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
}