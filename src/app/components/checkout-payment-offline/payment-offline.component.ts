import { Component, OnInit, AfterViewChecked, Input, Output, EventEmitter, SimpleChange, OnChanges } from '@angular/core';
import { Payment } from "app/models/payment/payment";
import { PaymentMethod } from "app/models/payment/payment-method";
import { Shipping } from "app/models/shipping/shipping";

@Component({
    moduleId: module.id,
    selector: 'payment-offline',
    templateUrl: '../../views/payment-offline.component.html',

})
export class OfflinePaymentComponent implements OnInit {
    @Input() payments: Payment[] = [];
    @Input() shipping: Shipping = null;
    @Output() paymentUpdated: EventEmitter<Payment> = new EventEmitter<Payment>();

    private methodSelected: PaymentMethod = new PaymentMethod();

    constructor() { }

    ngOnInit() { }

    public selectPayment(payment: Payment){
        this.paymentUpdated.emit(payment);
    }

    availablePayments(): Payment[]{
        let shippingRef = (this.shipping.deliveryInformation) ? this.shipping.deliveryInformation.deliveryMethodName.toLowerCase() : '';
        
        if(shippingRef != 'retirar na loja'){
            let index = this.payments.findIndex(p => p.name.toLowerCase() == 'pagamento na loja');
            this.payments.splice(index, 1);
        }
        if(shippingRef != 'transporte próprio'){
            let index = this.payments.findIndex(p => p.name.toLowerCase() == 'pagamento na entrega');
            this.payments.splice(index, 1);
        }

        return this.payments;
    }
}