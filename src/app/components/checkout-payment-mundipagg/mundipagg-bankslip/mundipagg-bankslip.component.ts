import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Payment } from "app/models/payment/payment";
import { PaymentSelected } from "app/models/payment/checkout-payment";
import { Shipping } from "app/models/shipping/shipping";
import { PaymentMethod } from "app/models/payment/payment-method";
import { AppSettings } from "app/app.settings";
import { PaymentService } from "app/services/payment.service";
import { PaymentMethodTypeEnum } from "app/enums/payment-method-type.enum";
import { Globals } from "app/models/globals";

@Component({
    selector: 'mundipagg-bankslip',
    templateUrl: '../../../views/payment-mundipagg-bankslip.component.html',
})
export class MundipaggBankslipComponent implements OnInit {
    @Input() payment: Payment;
    @Input() shipping: Shipping = null;
    @Input() actualPayment: Payment;
    
    @Output() paymentUpdated: EventEmitter<PaymentSelected> = new EventEmitter<PaymentSelected>();

    paymentSelected: Payment = new Payment();
    methodSelected: PaymentMethod = new PaymentMethod();
    mediaPathPayments: string;
    private methodType: PaymentMethodTypeEnum;
    
    constructor(private service: PaymentService, private globals: Globals) { }

    ngOnInit() {
        this.mediaPathPayments = `${this.globals.store.link}/static/payments/`;
     }

    isBankSlip(){
        if(this.methodType == PaymentMethodTypeEnum.BankSlip)
             return true;
        else
            return false;
    }

    getBankSlips(): PaymentMethod[]{
        let bankslips: PaymentMethod[] = [];
        this.payment.paymentMethods.forEach(m => {
            if(m.type == PaymentMethodTypeEnum.BankSlip){
                bankslips.push(m);
            }
        });

        if(bankslips.length == 1 && this.isMundipaggBankslip())
            this.selectMethod(null, bankslips[0]);

        return bankslips;
    }

    selectMethod(event, method: PaymentMethod){
        if(event)
            event.preventDefault();

        this.methodSelected = method;
        let selected = new PaymentSelected(this.payment, this.methodSelected);
        this.paymentUpdated.emit(selected);
    }

    isMundipaggBankslip(): boolean{
        if(!this.actualPayment)
            return false;
        else{
            if(this.actualPayment.name.toLowerCase() != 'mundipagg')
                return false;
            else if(this.actualPayment.paymentMethods[0].name.toLowerCase() == 'boleto')
                return true;
            else
                return false;
        }
    }
}