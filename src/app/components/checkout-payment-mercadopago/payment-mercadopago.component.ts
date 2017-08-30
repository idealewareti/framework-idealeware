import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Payment } from "app/models/payment/payment";
import { PaymentService } from "app/services/payment.service";
import { Cart } from "app/models/cart/cart";
import { CreditCard } from "app/models/payment/credit-card";
import { PaymentSelected } from "app/models/payment/checkout-payment";
import { Shipping } from "app/models/shipping/shipping";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgProgressService } from "ngx-progressbar";
import { MercadoPagoInstallmentResponse } from "app/models/mercadopago/mercadopago-installment-response";
import { MercadoPagoPaymentMethod } from "app/models/mercadopago/mercadopago-paymentmethod";
import { MercadoPagoPayerCost } from "app/models/mercadopago/mercadopago-payer-cost";

declare var Mercadopago: any;
declare var swal: any;
declare var toastr: any;

@Component({
    moduleId: module.id,
    selector: 'mercadopago',
    templateUrl: '../../views/payment-mercadopago.component.html',
})

export class PaymentMercadoPagoComponent implements OnInit {
    @Input() payments: Payment[];
    @Input() cart: Cart;
    @Input() payment: Payment;
    @Input() shipping: Shipping = null;

    @Output() paymentUpdated: EventEmitter<PaymentSelected> = new EventEmitter<PaymentSelected>();

    paymentMethods: MercadoPagoPaymentMethod[] = [];
    typeSelected: MercadoPagoPaymentMethod = new MercadoPagoPaymentMethod();
    installmentResponse: MercadoPagoInstallmentResponse = new MercadoPagoInstallmentResponse();
    creditCardType: MercadoPagoPaymentMethod = new MercadoPagoPaymentMethod({payment_type_id: 'credit_card'});
    creditCardForm: FormGroup;
    paymentSelected: PaymentSelected = new PaymentSelected();

    private public_key: string;
    private bin: string;
    private totalPurchasePrice: number;

    constructor(
        private service: PaymentService,
        formBuilder: FormBuilder,
        private loaderService: NgProgressService,

    ) {
        this.creditCardForm = formBuilder.group({
            cardNumber: ['', Validators.required],
            installment: ['', Validators.required],
            holder: ['', Validators.required],
            expMonth: ['', Validators.required],
            expYear: ['', Validators.required],
            cvv: ['', Validators.required],
            taxId: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.service.MercadoPagoGetPaymentsMethods()
        .then(response => {
            this.paymentMethods = response.filter(m => m.status == 'active');
        })
        .catch(error => {
            console.log(error);
        });
        
        this.service.GetMercadoPagoPublicKey()
        .then(response => {
            this.public_key = response;
            Mercadopago.setPublishableKey(this.public_key);
        })
        .catch(error => {
            console.log(error);
        });
    }

    ngAfterContentChecked() {
        if(this.typeSelected && this.isCreditCard() && this.cardOK()){
            this.paymentUpdated.emit(this.paymentSelected);
        }

    }

    /* Validations */
    private cardOK(): boolean{
        if(!this.paymentSelected)
            return false;
        else if(!this.paymentSelected.creditCard)
            return false;
        else if(!this.paymentSelected.creditCard.creditCardBrand)
            return false;
        else if(!this.paymentSelected.creditCard.creditCardNumber)
            return false;
        else if(!this.paymentSelected.creditCard.expMonth)
            return false;
        else if(!this.paymentSelected.creditCard.expYear)
            return false;
        else if(!this.paymentSelected.creditCard.holderName)
            return false;
        else if(!this.paymentSelected.creditCard.installmentCount)
            return false;
        else if(!this.paymentSelected.creditCard.installmentValue)
            return false;
        else if(!this.paymentSelected.creditCard.securityCode)
            return false;
        else if(!this.paymentSelected.creditCard.taxId)
            return false;
        else
            return true;
    }

    /* Methods */
    creditCardsMethods(): MercadoPagoPaymentMethod[]{
        return this.paymentMethods.filter(m => m.payment_type_id == 'credit_card');
    }

    bankslipMethod(): MercadoPagoPaymentMethod{
        return this.paymentMethods.filter(m => m.payment_type_id == 'ticket')[0];
    }
    
    selectType(method: MercadoPagoPaymentMethod, event = null) {
        if(event)
            event.preventDefault();

        this.typeSelected = method;
        this.paymentSelected = new PaymentSelected(this.payment, null, null, this.typeSelected);
        this.paymentUpdated.emit(this.paymentSelected);

        if(this.isCreditCard())
            this.paymentSelected.creditCard = new CreditCard();
    }

    selectInstallment(event){
        this.paymentSelected.creditCard.installmentCount = parseInt(event.target.value);
        this.paymentSelected.creditCard.installmentValue = this.getInstallmentValue(this.installmentResponse.payer_costs.find(i => i.installments == event.target.value).recommended_message);
    }

    getInstallmentValue(str): number{
        return parseFloat(/\d+[,]\d+/.exec(str)[0].replace(',', '.'))
    }

    /* Detections */
    detectCard(event) {
        if (event) {
            let card = event.replace(/-/g, '');
            let bin = this.getBin(card);
            if (card.length >= 10 && bin != this.bin) {
                this.loaderService.start();
                toastr['info']('Identificando o cartão');
                this.getCardBrand(this.paymentSelected.creditCard.creditCardNumber)
                .then(method => {
                    this.typeSelected = method;
                    this.paymentSelected.creditCard.creditCardBrand = method.name;
                    toastr['success'](`Cartão ${this.paymentSelected.creditCard.creditCardBrand} identificado`);
                    let cartId = localStorage.getItem('cart_id');
                    toastr['info']('Obtendo parcelas');
                    return this.service.MercadoPagoGetInstalments(method.id, this.cart.totalPurchasePrice);
                })
                .then(response => {
                    this.installmentResponse = response;
                    this.getMinInstallments()
                    this.loaderService.done;
                    
                    this.paymentSelected.mercadopago = this.typeSelected;
                    this.paymentUpdated.emit(this.paymentSelected);
                })
                .catch(error => {
                    toastr['error'](error);
                    this.loaderService.done;
                    swal('Erro ao obter as formas de pagamento', 'Falha ao obter as formas de pagamento do MercadoPago', 'error');
                })
            }
            else{
                if(bin.length < 6 || card.length == 0){
                    this.installmentResponse = new MercadoPagoInstallmentResponse();
                    this.paymentSelected.creditCard = new CreditCard();
                    this.typeSelected = this.creditCardType;
                }
            }
        }
    }

    getCardBrand(cardnumber: string): Promise<MercadoPagoPaymentMethod> {
        return new Promise((resolve, reject) => {
            this.bin = this.getBin(cardnumber);
            Mercadopago.getPaymentMethod({'bin': this.bin}, (status, response) => {
                if(status == 200){
                    resolve(new MercadoPagoPaymentMethod(response[0]));
                }
                else{
                    reject('Cartão de Crédito não suportado');
                }
            });

        });

    }

    /* Checkers */
    hasError(key: string): boolean {
        return (this.creditCardForm.controls[key].touched && this.creditCardForm.controls[key].invalid);
    }

    isCreditCard(): boolean{
        if(this.typeSelected && this.typeSelected.payment_type_id == 'credit_card')
            return true;
        else return false;
    }

    isBankSlip(): boolean{
        if(this.typeSelected && this.typeSelected.payment_type_id == 'ticket')
            return true;
        else return false;
    }

    isBrandSelected(brand: string): boolean{
        if(this.typeSelected.id == brand)
            return true;
        else return false;
    }

    /* Auxiliar Methods */
    getBin(cardNumber: string){
        return cardNumber.replace(/[ .-]/g, '').slice(0, 6);
    }

    getMinInstallments(){
        let installmentLimitMin = Number.MAX_SAFE_INTEGER;
        this.cart.products.forEach(product => {
            if(product.installmentLimit != 0 && product.installmentLimit < installmentLimitMin)
                installmentLimitMin = product.installmentLimit;
        });

        let index = this.installmentResponse.payer_costs.findIndex(i => i.installments == installmentLimitMin);
        if(index > -1)
            this.installmentResponse.payer_costs.splice(index +1, this.installmentResponse.payer_costs.length);

    }
}