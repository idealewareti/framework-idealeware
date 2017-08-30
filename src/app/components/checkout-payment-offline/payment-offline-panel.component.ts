import { Component, OnInit, OnChanges, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { Payment } from "app/models/payment/payment";
import { PaymentMethod } from "app/models/payment/payment-method";

@Component({
    moduleId: module.id,
    selector: 'payment-offline-panel',
    templateUrl: '../../views/payment-offline-panel.component.html',
})
export class OfflinePaymentPanelComponent implements OnInit, OnChanges {
    @Input() payment: Payment = new Payment();
    @Output() methodUpdated: EventEmitter<PaymentMethod> = new EventEmitter<PaymentMethod>();
    
    private paymentSelected: Payment = new Payment();
    private methodSelected: PaymentMethod = new PaymentMethod();
    private paymentRef: string;
    
    constructor() { }

    ngOnInit() {
        
     }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if(this.payment.id){
            this.paymentRef = this.payment.name.toLowerCase();
            
            if(this.payment.type != 2){
                this.payment = null;
                this.methodSelected = new PaymentMethod();
            }
            if(this.paymentRef == 'pagamento na loja'){
                this.selectMethod(null, this.payment.paymentMethods[0]);
            }
        }
    }

    selectMethod(event, method: PaymentMethod){
        if(event)
            event.preventDefault();

        this.methodSelected = method;
        this.methodUpdated.emit(this.methodSelected);
    }

}