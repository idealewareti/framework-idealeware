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
    
    @Input() payments: Payment[];
    @Input() cart: Cart;
    @Input() payment: Payment;
    @Input() shipping: Shipping = null;

    @Output() paymentUpdated: EventEmitter<PaymentSelected> = new EventEmitter<PaymentSelected>();
    @Output() creditCardUpdated: EventEmitter<CreditCard> = new EventEmitter<CreditCard>();

    paymentSelected: Payment = new Payment();
    methodSelected: PaymentMethod = new PaymentMethod();
    pagseguro_session: string;
    paymentMethods: PagseguroMethod[] = [];
    typeSelected: PagseguroMethod = new PagseguroMethod();
    optionSelected: PagseguroOption = new PagseguroOption();
    creditCard: CreditCard = new CreditCard();
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
            cvv: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.service.createPagSeguroSession()
        .then(session => {
            this.pagseguro_session = session;
            this.totalPurchasePrice = this.cart.totalPurchasePrice;
            PagSeguroDirectPayment.setSessionId(this.pagseguro_session);

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
				    
			    }
		    });
        })
        .catch(error => console.log(error));

     }

     ngAfterContentChecked() {
         this.cart = JSON.parse(localStorage.getItem('shopping_cart'));
         if(this.totalPurchasePrice != this.cart.totalPurchasePrice){
             this.totalPurchasePrice = this.cart.totalPurchasePrice;
             this.creditCard = new CreditCard();
             this.creditCardUpdated.emit(this.creditCard);
         }
         else{
             if(this.installments.length > 0 && this.creditCard.installmentCount){
                this.creditCard.installmentValue = this.installments[this.creditCard.installmentCount -1].installmentAmount;
                this.creditCard.noInterestInstallmentQuantity = this.getInstallmentFreeInterest();
                this.creditCardUpdated.emit(this.creditCard);
             }
         }
     }

     selectType(method: PagseguroMethod, payment: Payment){
        this.typeSelected = method;
        this.paymentSelected = this.payment;

        if(this.typeSelected.code == 2)
            this.selectOption(null, this.typeSelected.options[0]);
        else
            this.selectOption(null, new PagseguroOption());
     }
     
     selectOption(event = null, option: PagseguroOption){
        if(event) event.preventDefault();
        this.optionSelected = option;
        let selected = new PaymentSelected(this.payment, null, this.optionSelected);
        this.paymentUpdated.emit(selected);
     }

     availableMethods(){
        return this.paymentMethods.filter(m => m.code == 1 || m.code == 2);
     }

     getCardBrand(cardnumber: string){
        for(let k in this.regexBrands){
            if(this.regexBrands[k].test(cardnumber))
                return k;
        }
    }

    detectCard(event){
        if(event){
            let card = event.replace(/-/g, '');
            if(card.length == 16){
                this.loaderService.start();
                toastr['info']('Identificando o cartão');
                this.creditCard.creditCardBrand = this.getCardBrand(this.creditCard.creditCardNumber.replace(/-/g, '')).toLowerCase();
                this.creditCard.noInterestInstallmentQuantity = Number.parseInt(this.payment.settings.find(s => s.name == ("NoInterestInstallmentQuantity")).value);
                if(this.creditCard.creditCardBrand){
                    toastr['success'](`Cartão ${this.creditCard.creditCardBrand} identificado`);
                    let cartId = localStorage.getItem('cart_id');
                    toastr['info']('Obtendo parcelas');
                    PagSeguroDirectPayment.getInstallments({
                        
                        amount: this.cart.totalPurchasePrice,
                        brand: this.creditCard.creditCardBrand,
                        maxInstallmentNoInterest: this.creditCard.noInterestInstallmentQuantity,
                        success: response => {
                            this.installments = response.installments[this.creditCard.creditCardBrand].map(i => i = new PagseguroInstallment(i));
                            this.getMinInstallments();
                            this.paymentMethods.forEach(m => {
                                let option = m.options.filter(o => o.name == this.creditCard.creditCardBrand.toUpperCase())[0];
                                if(option){
                                    let selected = new PaymentSelected(this.payment, null, option);
                                    this.creditCardUpdated.emit(this.creditCard);
                                    this.paymentUpdated.emit(selected);
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
                }
                else{
                    this.loaderService.done();
                }
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
        let installment = [];
        this.cart.products.forEach(a => {
            if(a.installmentLimit != 0)
                installment.push(a.installmentLimit);    
        });

        let min = Math.min.apply(Math,installment);
        let index = this.installments.findIndex(i => i.quantity == min);
        if(index > -1){
            this.installments.splice(index + 1, this.installments.length);
        }

    }

    public getOfflinePayments(): Payment[]{
        return this.payments.filter(p => p.type == 2);
    }

    public handleOfflinePayment(event: Payment){
        this.selectMethodType(event.type, event);
    }

    public selectMethodType(type, payment: Payment){
        this.methodType = type.value;
        this.paymentSelected = this.payment;
    }

    public selectMethod(event, method){
        if(event)
            event.preventDefault();

        this.methodSelected = method;

        let selected = new PaymentSelected(this.paymentSelected, this.methodSelected);
        this.paymentUpdated.emit(selected);
    }

    public handleMethodUpdated(event: PaymentMethod){
        this.selectMethod(null, event);
    }

    hasError(key: string): boolean{
        return (this.creditCardForm.controls[key].touched && this.creditCardForm.controls[key].invalid);
    }

    isBankSlip(): boolean{
        return this.typeSelected.code == 2;
    }

    setInstallmentValue(event){
        this.creditCard.installmentValue = this.installments[this.creditCard.installmentCount -1].installmentAmount;
        this.creditCardUpdated.emit(this.creditCard);
    }
     
}