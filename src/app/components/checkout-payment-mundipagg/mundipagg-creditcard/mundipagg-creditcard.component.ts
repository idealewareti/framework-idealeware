import { Component, OnInit, AfterContentChecked, Input, Output, EventEmitter } from '@angular/core';
import { Payment } from "app/models/payment/payment";
import { Shipping } from "app/models/shipping/shipping";
import { PaymentSelected } from "app/models/payment/checkout-payment";
import { CreditCard } from "app/models/payment/credit-card";
import { AppSettings } from "app/app.settings";
import { PaymentMethod } from "app/models/payment/payment-method";
import { PaymentService } from "app/services/payment.service";
import { NgProgressService } from "ngx-progressbar";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Globals } from "app/models/globals";

declare var toastr: any;

@Component({
    selector: 'mundipagg-creditcard',
    templateUrl: '../../../views/payment-mundipagg-creditcard.component.html',
})
export class MundipaggCreditCardComponent implements OnInit {
    @Input() payment: Payment = new Payment();
    @Input() shipping: Shipping = null;
    
    @Output() paymentUpdated: EventEmitter<PaymentSelected> = new EventEmitter<PaymentSelected>();

    creditCard: CreditCard = new CreditCard();
    paymentSelected: PaymentSelected = new PaymentSelected();
    methodSelected: PaymentMethod = new PaymentMethod();
    creditCardForm: FormGroup;
    mediaPathPayments: string;

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
    
    constructor(
        private service: PaymentService, 
        formBuilder: FormBuilder, 
        private loaderService: NgProgressService,
        private globals: Globals
    ) {
        this.mediaPathPayments = `${this.globals.store.link}/static/payments/`;
        
        this.creditCardForm = formBuilder.group({
            cardNumber: ['', Validators.required],
            installment: ['', Validators.required],
            holder: ['', Validators.required],
            expMonth: ['', Validators.required],
            expYear: ['', Validators.required],
            cvv: ['', Validators.required],
        });
     }

    ngOnInit() { }

    ngAfterContentChecked() {
        if(this.isCardOK()){
            this.paymentSelected.creditCard = this.creditCard;
            this.paymentSelected.method = this.methodSelected;
            this.creditCard = this.creditCard;

            this.paymentUpdated.emit(this.paymentSelected);
        }
    }

    isCardOK(): boolean{
        if(!this.creditCard.creditCardBrand)
            return false;
        else if(!this.creditCard.creditCardNumber)
            return false;
        else if(!this.creditCard.expMonth)
            return false;
        else if(!this.creditCard.expYear)
            return false;
        else if(!this.creditCard.holderName)
            return false;
        else if(!this.creditCard.installmentCount)
            return false;
        else if(!this.creditCard.securityCode)
            return false;
        else return true;
    }

    getCardBrand(cardnumber: string): string{
        let brand: string = null;
        for(let k in this.regexBrands){
            if(this.regexBrands[k].test(cardnumber.replace(/-/g, ''))){
                brand = k;
            }
        }

        return brand;
    }
    
    detectCard(event){
        if(event){
            let card = event.replace(/-/g, '');
            if(card.length == 16){
                toastr['info']('Identificando o cartão');
                this.creditCard.creditCardBrand = this.getCardBrand(this.creditCard.creditCardNumber);
                if(this.creditCard.creditCardBrand){
                    toastr['success'](`Cartão ${this.paymentSelected.creditCard.creditCardBrand} identificado`);
                    let cartId = localStorage.getItem('cart_id');
                    this.paymentSelected.creditCard = this.creditCard;
                    this.paymentSelected.payment = this.payment;
                    this.paymentSelected.method = this.methodSelected;
                    this.paymentUpdated.emit(this.paymentSelected);
                    this.service.simulateInstallments(cartId)
                    .then(payments => {
                        let simulated = payments.find(p => p.id == this.payment.id);
                        this.methodSelected = simulated.paymentMethods.filter(m => m.name == this.creditCard.creditCardBrand.toUpperCase())[0]
                        this.paymentSelected.method = this.methodSelected;
                        this.paymentUpdated.emit(this.paymentSelected);
                    })
                    .catch(error => console.log(error));
                }
                else{
                    toastr['error']('Cartão não identificado');
                }
            }
            else{
                this.paymentSelected.payment = this.payment;
                this.methodSelected.installment = [];
                this.paymentSelected.creditCard = new CreditCard();
                this.paymentSelected.method =  null;
                this.paymentUpdated.emit(this.paymentSelected);
            }
        }
    }
}