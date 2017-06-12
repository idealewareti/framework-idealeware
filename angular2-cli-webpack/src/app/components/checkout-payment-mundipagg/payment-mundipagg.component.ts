import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { Payment } from "app/models/payment/payment";
import { AppTexts } from "app/app.texts";
import { PaymentMethod } from "app/models/payment/payment-method";
import { CreditCard } from "app/models/payment/credit-card";
import { PaymentService } from "app/services/payment.service";
import { AppSettings } from "app/app.settings";
import { Shipping } from "app/models/shipping/shipping";
import { PaymentSelected } from "app/models/payment/checkout-payment";

@Component({
    moduleId: module.id,
    selector: 'mundipagg',
    templateUrl: '../../views/payment-mundipagg.component.html',
})
export class PaymentMundipaggComponent implements OnInit {
    @Input() payments: Payment[];
    @Input() shipping: Shipping = null;

    @Output() paymentUpdated: EventEmitter<PaymentSelected> = new EventEmitter<PaymentSelected>();
    @Output() creditCardUpdated: EventEmitter<CreditCard> = new EventEmitter<CreditCard>();

    private payment: Payment = new Payment();
    public availableMethodTypes = [];
    public readonly paymentMethodTypes = AppTexts.PAYMENT_METHOD_TYPES;
    private methodType: number;
    paymentSelected: Payment = new Payment();
    methodSelected: PaymentMethod = new PaymentMethod();
    creditCard: CreditCard = new CreditCard();
    public readonly mediaPathPayments = `${AppSettings.MEDIA_PATH}/payments/`;

    private regexBrands = {
        Visa: /^4[0-9]{6,}$/,
        Mastercard: /^5[1-5][0-9]{5,}|222[1-9][0-9]{3,}|22[3-9][0-9]{4,}|2[3-6][0-9]{5,}|27[01][0-9]{4,}|2720[0-9]{3,}$/,
        Amex: /^3[47][0-9]{5,}$/,
        Diners: /^3(?:0[0-5]|[68][0-9])[0-9]{4,}$/,
        Elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})$/,
        Hipercard: /^(606282\d{10}(\d{3})?)|(3841\d{15})$/,
        Aura: /^50[0-9]{14,17}/,
        Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/
    }
    
    constructor(private service: PaymentService) { }

    ngOnInit() {
        this.payment = this.payments.filter(p => p.type == 1)[0];
        this.paymentMethodTypes.forEach(t => {
            if(this.paymentAvailable(t.value)){
                this.availableMethodTypes.push(t);
                return;
            }
        });
     }

     ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
         if(changes['shipping']){
             this.selectType({value: 0}, new Payment());
             this.selectMethod(null, new PaymentMethod());
         }
     }

    private paymentAvailable(type: number): boolean{
        let available = false
        if(this.payment.paymentMethods.filter(m => m.type == type).length > 0) 
            available = true;
        return available;;
    }

    public selectType(type, payment: Payment){
        this.methodType = type.value;
        this.paymentSelected = payment;

        if(this.isBankSlip())
            this.selectMethod(null, this.getBankSlips()[0]);
    }

    public getPaymentLabel(type){
        return this.paymentMethodTypes.filter(m => m.value == type)[0].label;
    }

    public isCreditCard(){
        if(this.methodType == 1) return true;
        else return false;
    }

    public isBankSlip(){
        if(this.methodType == 2) return true;
        else return false;
    }

    public isOtherMethods(){
        if(this.payments.filter(p => p.type == 1).length > 0) return true;
        else return false;
    }

    public getBankSlips(): PaymentMethod[]{
        let slips = [];
        this.payment.paymentMethods.forEach(m => {
            if(m.type == 2){
                slips.push(m);
            }
        });

        return slips;
    }

    public selectMethod(event, method){
        if(event)
            event.preventDefault();

        this.methodSelected = method;

        let selected = new PaymentSelected(this.paymentSelected, this.methodSelected);
        this.paymentUpdated.emit(selected);
    }

    getCardBrand(cardnumber: string){
        for(let k in this.regexBrands){
            if(this.regexBrands[k].test(cardnumber))
                return k;
        }
    }

    detectCard(event){
        if(event.length == 16){
            this.creditCard.creditCardBrand = this.getCardBrand(this.creditCard.creditCardNumber);
            if(this.creditCard.creditCardBrand){
                let cartId = localStorage.getItem('cart_id');
                this.creditCardUpdated.emit(this.creditCard);
                this.service.simulateInstallments(cartId)
                .then(payments => {
                    this.methodSelected = payments[0].paymentMethods.filter(m => m.name == this.creditCard.creditCardBrand.toUpperCase())[0]
                    let selected = new PaymentSelected(this.paymentSelected, this.methodSelected);
                    this.paymentUpdated.emit(selected);
                })
                .catch(error => console.log(error));
            }
        }
        else{
            this.methodSelected.installment = [];
        }
    }

    public getOfflinePayments(): Payment[]{
        return this.payments.filter(p => p.type == 2);
    }

    public handleOfflinePayment(event: Payment){
        this.selectType(event.type, event);
    }

    public handleMethodUpdated(event: PaymentMethod){
        this.selectMethod(null, event);
    }
}