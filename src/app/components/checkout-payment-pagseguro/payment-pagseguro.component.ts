import { Component, OnInit, Input, Output, EventEmitter, AfterContentChecked } from '@angular/core';
import { Payment } from "app/models/payment/payment";
import { PaymentService } from "app/services/payment.service";
import { Cart } from "app/models/cart/cart";
import { PagseguroMethod } from "app/models/pagseguro/pagseguro-method";
import { PagseguroOption } from "app/models/pagseguro/pagseguro-option";
import { CreditCard } from "app/models/payment/credit-card";
import { PagseguroInstallment } from "app/models/pagseguro/pagseguro-installment";
import { PaymentSelected } from "app/models/payment/checkout-payment";
import { Shipping } from "app/models/shipping/shipping";
import { PaymentMethod } from "app/models/payment/payment-method";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgProgressService } from "ngx-progressbar";
import { PaymentSetting } from "app/models/payment/payment-setting";
import { PagseguroCardBrand } from 'app/models/pagseguro/pagseguro-card-brand';

declare var PagSeguroDirectPayment: any;
declare var swal: any;
declare var toastr: any;

@Component({
    moduleId: module.id,
    selector: 'pagseguro',
    templateUrl: '../../views/payment-pagseguro.component.html',
    styleUrls: ['../../styles/payment-pagseguro.component.css']
})
export class PaymentPagseguroComponent implements OnInit {
    
    @Input() cart: Cart;
    @Input() payment: Payment;
    @Input() shipping: Shipping = null;

    @Output() paymentUpdated: EventEmitter<PaymentSelected> = new EventEmitter<PaymentSelected>();

    paymentSelected: PaymentSelected = new PaymentSelected();
    methodSelected: PaymentMethod = new PaymentMethod();
    pagseguro_session: string;
    paymentMethods: PagseguroMethod[] = [];
    typeSelected: PagseguroMethod = new PagseguroMethod();
    optionSelected: PagseguroOption = new PagseguroOption();
    installments: PagseguroInstallment[] = [];
    private methodType: number;
    private totalPurchasePrice: number;

    creditCardForm: FormGroup;

    public readonly pagseguro_media = 'https://stc.pagseguro.uol.com.br';
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

    ) {
        this.creditCardForm = formBuilder.group({
            cardNumber: ['', Validators.compose([
                Validators.required,
                Validators.maxLength(19),
                Validators.minLength(19)
            ])],
            installment: ['', Validators.required],
            holder: ['', Validators.required],
            expMonth: ['', Validators.required],
            expYear: ['', Validators.required],
            cvv: ['', Validators.required],
            cpf: ['', Validators.required],
            birthDate: ['', Validators.required],
            phone: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.paymentSelected = new PaymentSelected(this.payment, null, null, null, new CreditCard());

        this.service.createPagSeguroSession()
        .then(session => {
            this.pagseguro_session = session;
            this.totalPurchasePrice = this.cart.totalPurchasePrice;
            PagSeguroDirectPayment.setSessionId(this.pagseguro_session);
            this.loaderService.start();
            PagSeguroDirectPayment.getPaymentMethods({
			    amount: this.cart.totalPurchasePrice,
			    success: response => {
				    for(let k in response.paymentMethods){
                        this.paymentMethods.push(new PagseguroMethod(response.paymentMethods[k]));
                    }

                    if(this.paymentMethods.length == 0){
                        swal('Erro ao obter as formas de pagamento', 'Falha ao obter as formas de pagamento do Pagseguro', 'error');
                    }
			    },
			    error: response => {
				    console.log(response);
                    swal('Erro ao obter as formas de pagamento', 'Falha ao obter as formas de pagamento do Pagseguro', 'error');
			    },
			    complete: response => {
                    this.loaderService.done();
			    }
		    });
        })
        .catch(error => console.log(error));

     }

     ngAfterContentChecked() {
        if(this.isCreditCard() && this.cardOK()){
            this.paymentSelected.creditCard.installmentValue = this.installments[this.paymentSelected.creditCard.installmentCount -1].installmentAmount;
            this.paymentSelected.creditCard.noInterestInstallmentQuantity = this.getInstallmentFreeInterest();
            this.paymentUpdated.emit(this.paymentSelected);
        }

    }

    /* Validations */
    private cardOK(): boolean{
        if(!this.paymentSelected.creditCard.creditCardBrand)
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
        else if(!this.paymentSelected.creditCard.securityCode)
            return false;
        else if(!this.paymentSelected.creditCard.taxId)
            return false;
        else if(!this.paymentSelected.creditCard.phone)
            return false;
        else if(!this.paymentSelected.creditCard.birthDate)
            return false;
        else
            return true;
    }

    selectType(method: PagseguroMethod, event = null){
        if(event)
            event.preventDefault();

        this.typeSelected = method;

        if(this.typeSelected.code == 2)
            this.selectOption(null, this.typeSelected.options[0]);
        else
            this.selectOption(null, new PagseguroOption());
     }

    selectOption(event = null, option: PagseguroOption){
        if(event)
             event.preventDefault();
        this.optionSelected = option;
        this.paymentSelected.payment = this.payment;
        this.paymentSelected.pagseguro = this.optionSelected;
        this.paymentUpdated.emit(this.paymentSelected);
     }

    availableMethods(): PagseguroMethod[]{
        return this.paymentMethods.filter(m => m.code == 1 || m.code == 2);
     }

    getCardBrand(cardnumber: string): Promise<PagseguroCardBrand>{
        return new Promise((resolve, reject) => {
            let bin: string = cardnumber.substring(0, 6);
            PagSeguroDirectPayment.getBrand({ 
                cardBin: bin, 
                success: (response) => {
                    resolve(new PagseguroCardBrand(response.brand));
                },
                error: (response) => { 
                    console.log(response); 
                    reject('Cartão Inválido');
                }
            });
        });
        
    }

    detectCard(inputCardNumber: string){
        if(inputCardNumber){
            let card = inputCardNumber.replace(/-/g, '');
            if(card.length == 16){
                this.loaderService.start();
                toastr['info']('Identificando o cartão');

                this.getCardBrand(this.paymentSelected.creditCard.creditCardNumber.replace(/-/g, ''))
                .then(brand => {
                    this.loaderService.done();
                    this.paymentSelected.creditCard.creditCardBrand = brand.name;
                    this.paymentSelected.creditCard.noInterestInstallmentQuantity = Number.parseInt(this.payment.settings.find(s => s.name == ("NoInterestInstallmentQuantity")).value);
                    toastr['success'](`Cartão ${this.paymentSelected.creditCard.creditCardBrand} identificado`);
                    return brand;
                })
                .then(() => {
                    this.loaderService.start();
                    toastr['info']('Obtendo parcelas');
                    let cartId = localStorage.getItem('cart_id');
                    PagSeguroDirectPayment.getInstallments({
                        amount: this.cart.totalPurchasePrice,
                        brand: this.paymentSelected.creditCard.creditCardBrand,
                        maxInstallmentNoInterest: this.paymentSelected.creditCard.noInterestInstallmentQuantity,
                        success: response => {
                            this.installments = response.installments[this.paymentSelected.creditCard.creditCardBrand].map(i => i = new PagseguroInstallment(i));
                            this.getMinInstallments();
                            this.paymentMethods.forEach(m => {
                                let option = m.options.filter(o => o.name == this.paymentSelected.creditCard.creditCardBrand.toUpperCase())[0];
                                if(option){
                                    this.optionSelected = option;
                                    this.paymentSelected.payment = this.payment;
                                    this.paymentSelected.pagseguro = this.optionSelected;
                                    this.paymentUpdated.emit(this.paymentSelected);
                                }
                            })
                        },
                        error: response => {
                            console.log(response);
                            this.installments = [];
                        }, 
                        complete: response => {
                            this.loaderService.done();
                        }
                    });
                })
                .catch(error => {
                    toastr['error'](error);
                    this.loaderService.done();
                });
            }
            else{
                this.installments = [];
                this.paymentSelected.payment = this.payment;
                this.paymentSelected.pagseguro = null;
                this.paymentSelected.creditCard = new CreditCard();
                this.paymentUpdated.emit(this.paymentSelected);
            }
        }
    }

    getInstallmentFreeInterest(): number{
        for(let i = 0; i < this.installments.length; i++){
            if(!this.installments[i].interestFree)
                return i;
        }

        return 0;
    }

    getMinInstallments(){
        let installmentLimitMin = Number.MAX_SAFE_INTEGER;
        this.cart.products.forEach(product => {
            if(product.installmentLimit != 0 && product.installmentLimit < installmentLimitMin)
                installmentLimitMin = product.installmentLimit;
        });

        let installmentLimit: PaymentSetting = this.payment.settings.find(s => s.name.toLowerCase() == 'installmentlimit');
        if(installmentLimit && Number.parseInt(installmentLimit.value) < installmentLimitMin)
            installmentLimitMin = Number.parseInt(installmentLimit.value);

        let index = this.installments.findIndex(i => i.quantity == installmentLimitMin);
        if(index > -1)
            this.installments.splice(index +1, this.installments.length);

    }

    hasError(key: string): boolean{
        return (this.creditCardForm.controls[key].touched && this.creditCardForm.controls[key].invalid);
    }

    isBankSlip(): boolean{
        return this.typeSelected.code == 2;
    }

    isCreditCard(): boolean{
        if(this.optionSelected.code >= 100 && this.optionSelected.code <= 199)
            return true;
        else
            return false;
    }

    isSelected(methodType: PagseguroMethod): boolean{
        if(this.typeSelected.code == methodType.code)
            return true;
        else return false;
    }
     
}