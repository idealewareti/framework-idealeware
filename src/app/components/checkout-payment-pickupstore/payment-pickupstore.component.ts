import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Payment } from "app/models/payment/payment";
import { Cart } from "app/models/cart/cart";
import { Shipping } from "app/models/shipping/shipping";
import { PaymentSelected } from "app/models/payment/checkout-payment";

@Component({
    selector: 'payment-pickupstore',
    templateUrl: '../../views/payment-pickupstorecomponent.html',
})
export class PaymentPickuUpStoreComponent implements OnInit {
    @Input() payment: Payment;
    @Input() payments: Payment[];
    @Input() cart: Cart;
    @Input() shipping: Shipping = null;

    @Output() paymentUpdated: EventEmitter<PaymentSelected> = new EventEmitter<PaymentSelected>();
    
    constructor() { }

    ngOnInit() { }
}