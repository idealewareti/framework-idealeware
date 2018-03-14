import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MercadoPagoPaymentMethod } from '../../../models/mercadopago/mercadopago-paymentmethod';
import { MercadoPagoPayment } from '../../../models/mercadopago/mercadopago';
import { CreditCard } from '../../../models/payment/credit-card';
import { Globals } from '../../../models/globals';
import { PaymentManager } from '../../../managers/payment.manager';
import { MercadoPagoInstallmentResponse } from '../../../models/mercadopago/mercadopago-installment-response';
import { PagseguroPayment } from '../../../models/pagseguro/pagseguro';
import { PagseguroCardBrand } from '../../../models/pagseguro/pagseguro-card-brand';
import { Payment } from '../../../models/payment/payment';
import { PagseguroInstallment } from '../../../models/pagseguro/pagseguro-installment';
import { PagseguroOption } from '../../../models/pagseguro/pagseguro-option';
import { PaymentMethod } from '../../../models/payment/payment-method';
import { MundipaggPayment } from '../../../models/mundipagg/mundipagg';
import { Installment } from '../../../models/payment/installment';
import { isPlatformBrowser } from '@angular/common';

declare var $: any;
declare var Mercadopago: any;
declare var PagSeguroDirectPayment: any;
declare var swal: any;
declare var toastr: any;

@Component({
    moduleId: module.id,
    selector: 'app-checkout-creditcard-form',
    templateUrl: '../../../template/checkout/checkout-creditcard-form/checkout-creditcard-form.html',
    styleUrls: ['../../../template/checkout/checkout-creditcard-form/checkout-creditcard-form.scss'],
})
export class CheckoutCreditCardFormComponent implements OnInit, OnChanges {
    @Input() mercadopago: MercadoPagoPayment = null;
    @Input() mundipagg: MundipaggPayment = null;
    @Input() pagseguro: PagseguroPayment = null;
    @Input() payment: Payment = new Payment();

    @Output() creditCardUpdated: EventEmitter<CreditCard> = new EventEmitter<CreditCard>();
    @Output() pagseguroUpdated: EventEmitter<PagseguroOption> = new EventEmitter<PagseguroOption>();
    @Output() mundipaggUpdated: EventEmitter<PaymentMethod> = new EventEmitter<PaymentMethod>();
    @Output() mercadoPagoUpdated: EventEmitter<MercadoPagoPaymentMethod> = new EventEmitter<MercadoPagoPaymentMethod>();

    creditCardForm: FormGroup;
    creditCard: CreditCard = new CreditCard();

    readonly pagseguro_media = 'https://stc.pagseguro.uol.com.br';

    private bin: string;
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
        private globals: Globals,
        private manager: PaymentManager,
        formBuilder: FormBuilder,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.creditCardForm = formBuilder.group({
            cardNumber: ['', Validators.required],
            installment: ['', Validators.required],
            holder: ['', Validators.required],
            expMonth: ['', Validators.required],
            expYear: ['', Validators.required],
            cvv: ['', Validators.required],
            taxId: ['', Validators.required],
            birthDate: ['', Validators.required],
            phone: ['', Validators.required]
        });
    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['payment'] && !changes.payment.firstChange) {
            this.resetCard();
        }
    }

    resetCard() {
        if (this.pagseguro)
            this.pagseguro.optionSelected = new PagseguroOption();
        else if (this.mundipagg)
            this.mundipagg.methodSelected = new PaymentMethod();
        else if (this.mercadopago)
            this.mercadopago.methodSelected = new MercadoPagoPaymentMethod();

        this.creditCard = new CreditCard();
        this.bin = null;
        this.creditCardUpdated.emit(this.creditCard);

    }

    /**
     * Evento que é acionado quando há alteração no form do cartão de crédito
     * 
     * @param {any} [event=null] 
     * @memberof CheckoutCreditCardFormComponent
     */
    onChange(event = null) {
        if (this.pagseguro) {
            // Pagseguro
            this.creditCard.payment = 'pagseguro';
            this.creditCard.installmentValue = this.PagseguroGetInstallmentValue(this.creditCard.installmentCount);
            this.creditCard.totalPurchasePrice = this.PagseguroGetTotalPurchasePrice(this.creditCard.installmentCount);
        }
        else if (this.mercadopago) {
            // Mercado Pago
            this.creditCard.payment = 'mercadopago';
            this.creditCard.installmentValue = this.MercadoPagoGetInstallmentValue(this.creditCard.installmentCount);
            this.creditCard.totalPurchasePrice = this.MercadopagoGetPurchasePrice(this.creditCard.installmentCount);
        }
        else if (this.mundipagg) {
            // Mundipagg
            this.creditCard.payment = 'mundipagg';
            this.creditCard.installmentValue = this.MundipaggGetInstallmentValue(this.creditCard.installmentCount);
            this.creditCard.totalPurchasePrice = this.MundipaggGetTotalPurchasePrice(this.creditCard.installmentCount);
        }

        this.creditCardUpdated.emit(this.creditCard);
    }

    /**
     * Informa se há erro no campo indicado pela key
     * 
     * @param {string} key 
     * @returns {boolean} 
     * @memberof CheckoutCreditCardFormComponent
     */
    hasError(key: string): boolean {
        return (this.creditCardForm.controls[key].touched && this.creditCardForm.controls[key].invalid);
    }

    /**
     * Retorna o BIN do cartão informado
     * 
     * @param {string} cardNumber 
     * @returns 
     * @memberof CheckoutCreditCardFormComponent
     */
    getBin(cardNumber: string) {
        return cardNumber.replace(/[ .-]/g, '').slice(0, 6);
    }

    /**
     * Busca nos produtos do carrinho o valor mínimo aceito de parcelamento
     * 
     * @returns {number} 
     * @memberof CheckoutCreditCardFormComponent
     */
    getMinInstallments(): number {
        let installmentLimitMin = Number.MAX_SAFE_INTEGER;
        this.globals.cart.products.forEach(product => {
            if (product.installmentLimit != 0 && product.installmentLimit < installmentLimitMin)
                installmentLimitMin = product.installmentLimit;
        });

        if (this.payment.name != null && this.payment.name.toLowerCase() == "pagseguro") {
            let pagseguroMin = Number.parseInt(this.payment.settings.find(a => a.name == "InstallmentLimit").value);
            if (pagseguroMin < installmentLimitMin) {
                installmentLimitMin = pagseguroMin;
            }
        }

        return installmentLimitMin;
    }

    /**
     * Desabilita o CTRL V no campo do número do cartão
     * 
     * @param {*} e 
     * @param {any} input 
     * @memberof CheckoutCreditCardFormComponent
     */
    onPaste(e: any, input) {
        let content = e.clipboardData.getData('text/plain');
        setTimeout(() => {
            this.creditCard.creditCardNumber = "";
            if (this.creditCardForm.controls['creditCardNumber']) {
                this.creditCardForm.controls.creditCardNumber.setValue("");
            }
            if (isPlatformBrowser(this.platformId)) {
                $('#cardNumber').val('');
            }
        }, 0);
    }

    /**
     * Detecta a badeira do cartão conforme ele é digitado
     * 
     * @param {any} event 
     * @memberof CheckoutCreditCardFormComponent
     */
    detectCard(event) {
        if (isPlatformBrowser(this.platformId)) {
            if (event) {
                let card = event.replace(/-/g, '');
                this.creditCard.creditCardNumber = card;
                let bin = this.getBin(card);

                // Se o método de pagamento for Mercado Pago
                if (this.mercadopago) {
                    if (card.length == 10 && bin != this.bin) {
                        // this.loaderService.start();
                        this.bin = bin;
                        toastr['info']('Identificando o cartão');
                        this.MercadoPagoDetectCard(this.creditCard.creditCardNumber)
                            .then(method => {
                                this.mercadopago.methodSelected = method;
                                this.creditCard.creditCardBrand = method.name;
                                toastr['success'](`Cartão ${this.creditCard.creditCardBrand} identificado`);
                                let cartId = localStorage.getItem('cart_id');
                                toastr['info']('Obtendo parcelas');
                                this.MercadoPagoGetInstallments(method);
                            })
                            .catch(error => {
                                toastr['error'](error);
                                // this.loaderService.done;
                                swal('Erro ao obter o parcelamento', 'Falha ao obter o parcelamento do MercadoPago', 'error');
                            })
                    }
                    else {
                        if (bin.length < 6 || card.length == 0) {
                            this.mercadopago.installmentResponse = new MercadoPagoInstallmentResponse();
                            this.creditCard = new CreditCard();
                            this.mercadopago.methodSelected = this.mercadopago.creditCardType;
                        }
                    }
                }
                // Se o método de pagamento for Pagseguro
                else if (this.pagseguro) {
                    if (card.length >= 14 && bin != this.bin) {
                        // this.loaderService.start();
                        this.bin = bin;
                        toastr['info']('Identificando o cartão');
                        this.PagseguroDetectBrand(this.creditCard.creditCardNumber.replace(/-/g, ''))
                            .then(brand => {
                                this.creditCard.creditCardBrand = brand.name;
                                this.creditCard.noInterestInstallmentQuantity = this.PagseguroNoInterestInstallmentQuantity();
                                toastr['success'](`Cartão ${brand.name} identificado`);
                                toastr['info']('Obtendo parcelas');
                                return this.PagseguroGetInstallments()
                            })
                            .then(installments => {
                                this.pagseguro.installments = installments;
                            })
                            .catch(error => {
                                toastr['error']('Erro ao obter as parcelas no Pagseguro');
                                console.log(error);
                            })
                    }
                }
                // Se o método de pagamento for Mundipagg
                else if (this.mundipagg) {
                    if (card.length >= 14 && bin != this.bin) {
                        // this.loaderService.start();
                        this.bin = bin;
                        toastr['info']('Identificando o cartão');
                        this.creditCard.creditCardBrand = this.MundipaggDetectCardBrand(card)
                        if (this.creditCard.creditCardBrand) {
                            // this.loaderService.done();
                            toastr['success'](`Cartão ${this.creditCard.creditCardBrand} identificado`);
                            toastr['info']('Obtendo parcelas');
                            // this.loaderService.start();
                            this.MundipaggGetInstallments(this.creditCard.creditCardBrand)
                                .then(method => {
                                    // this.loaderService.done();
                                    this.mundipagg.methodSelected = method;
                                })
                                .catch(error => {
                                    // this.loaderService.done();
                                    console.log(error);
                                    toastr['error'](error);
                                });
                        }
                        else {
                            // this.loaderService.done();
                            toastr['error']('Cartão não identificado');
                        }
                    }
                }
            }
        }
    }

    /*
    ** MERCADO PAGO
    */

    /**
     * Retorna as bandeiras de cartão aceitas pelo Mercado Pago
     * 
     * @returns {MercadoPagoPaymentMethod[]} 
     * @memberof CheckoutCreditCardFormComponent
     */
    MercadoPagoCreditCardBrands(): MercadoPagoPaymentMethod[] {
        return this.mercadopago.methods.filter(m => m.payment_type_id == 'credit_card');
    }

    /**
     * Verifica se a bandeira informada está selecionanda
     * Meio de pagamento: Mercado Pago
     * 
     * @param {string} brand 
     * @returns {boolean} 
     * @memberof CheckoutCreditCardFormComponent
     */
    MercadoPagoisBrandSelected(brand: string): boolean {
        if (brand && this.mercadopago.methodSelected.id == brand)
            return true;
        else return false;
    }

    /**
     * Detecta a bandeira do cartão de crédito no Mercado Pago
     * 
     * @param {string} cardnumber 
     * @returns {Promise<MercadoPagoPaymentMethod>} 
     * @memberof CheckoutCreditCardFormComponent
     */
    MercadoPagoDetectCard(cardnumber: string): Promise<MercadoPagoPaymentMethod> {
        return new Promise((resolve, reject) => {
            let bin = this.getBin(cardnumber);
            Mercadopago.getPaymentMethod({ 'bin': bin }, (status, response) => {
                if (status == 200) {
                    resolve(new MercadoPagoPaymentMethod(response[0]));
                }
                else {
                    reject('Cartão de Crédito não suportado');
                }
            });
        });
    }

    /**
     * Retorna o valor da parcela do Mercado Pago
     * 
     * @param {number} installment 
     * @returns {number} 
     * @memberof CheckoutCreditCardFormComponent
     */
    MercadoPagoGetInstallmentValue(installment: number): number {
        if (installment && this.mercadopago.installmentResponse.payer_costs.length > 0)
            return this.mercadopago.installmentResponse.payer_costs.find(c => c.installments == installment).installment_amount;
        else return 0;
    }

    /**
     * Retorna o valor da compra no Mercado Pago
     * 
     * @param {number} installment 
     * @returns {number} 
     * @memberof CheckoutCreditCardFormComponent
     */
    MercadopagoGetPurchasePrice(installment: number): number {
        if (installment) {
            let message = this.mercadopago.installmentResponse.payer_costs.find(c => c.installments == installment).recommended_message;
            message = message.match(/[(](.+)[)]/)[1]
                .replace('R$ ', '')
                .replace('.', '')
                .replace(',', '.');

            return Number.parseFloat(message);
        }
        else return 0;
    }

    /**
     * Obtem o parcelamento do Mercado Pago
     * 
     * @param {MercadoPagoPaymentMethod} method 
     * @memberof CheckoutCreditCardFormComponent
     */
    MercadoPagoGetInstallments(method: MercadoPagoPaymentMethod) {
        if (isPlatformBrowser(this.platformId)) {
            let totalPurchase: number = this.globals.cart.totalPurchasePrice;
            this.manager.getMercadoPagoInstalments(method.id, totalPurchase)
                .then(response => {
                    this.mercadopago.installmentResponse = response;
                    this.getMinInstallments();
                    this.mercadoPagoUpdated.emit(method);
                    // this.loaderService.done;
                })
                .catch(error => {
                    toastr['error'](error);
                    // this.loaderService.done;
                    swal('Erro ao obter o parcelamento', 'Falha ao obter o parcelamento do MercadoPago', 'error');
                });
        }
    }

    /**
     * Seta o parcelamento mínimo baseado no mínio de parcelamento permitido
     * 
     * @memberof CheckoutCreditCardFormComponent
     */
    MercadoPagoSetMinInstallments() {
        let installmentLimitMin = this.getMinInstallments();

        if (installmentLimitMin < Number.MAX_SAFE_INTEGER) {
            let index = this.mercadopago.installmentResponse.payer_costs.findIndex(i => i.installments == installmentLimitMin);
            if (index > -1)
                this.mercadopago.installmentResponse.payer_costs.splice(index + 1, this.mercadopago.installmentResponse.payer_costs.length);
        }
    }

    /*
    ** PAGSEGURO
    */
    /**
     * Detecta a bandeira do cartão no Pagseguro
     * 
     * @param {string} cardnumber 
     * @returns {Promise<PagseguroCardBrand>} 
     * @memberof CheckoutCreditCardFormComponent
     */
    PagseguroDetectBrand(cardnumber: string): Promise<PagseguroCardBrand> {
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

    /**
     * Retorna o parcelamento sem juros do Pagseguro
     * 
     * @returns {number} 
     * @memberof CheckoutCreditCardFormComponent
     */
    PagseguroGetInstallmentFreeInterest(): number {
        for (let i = 0; i < this.pagseguro.installments.length; i++) {
            if (!this.pagseguro.installments[i].interestFree)
                return i;
        }

        return 0;
    }

    /**
     * Retorna o número de parcelas sem juros no Pagseguro
     * 
     * @returns {number} 
     * @memberof CheckoutCreditCardFormComponent
     */
    PagseguroNoInterestInstallmentQuantity(): number {
        return Number.parseInt(this.payment.settings.find(s => s.name == ("NoInterestInstallmentQuantity")).value)
    }

    /**
     * Retorna as pareclas do Pagseguro
     * 
     * @returns {Promise<PagseguroInstallment[]>} 
     * @memberof CheckoutCreditCardFormComponent
     */
    PagseguroGetInstallments(): Promise<PagseguroInstallment[]> {
        return new Promise((resolve, reject) => {
            PagSeguroDirectPayment.getInstallments({
                amount: this.globals.cart.totalPurchasePrice,
                brand: this.creditCard.creditCardBrand,
                maxInstallmentNoInterest: this.PagseguroNoInterestInstallmentQuantity(),
                success: response => {
                    let installments = response.installments[this.creditCard.creditCardBrand].map(i => i = new PagseguroInstallment(i));
                    let minInstalments = this.getMinInstallments();
                    this.pagseguro.methods.forEach(m => {
                        let option = m.options.filter(o => o.name == this.creditCard.creditCardBrand.toUpperCase())[0];
                        if (option) {
                            this.pagseguro.optionSelected = option;
                            this.pagseguroUpdated.emit(option);
                        }
                    });
                    // this.loaderService.done();
                    if (minInstalments < Number.MAX_SAFE_INTEGER) {
                        installments.splice(minInstalments, installments.length);
                    }
                    resolve(installments)
                },
                error: response => {
                    // this.loaderService.done();
                    console.log(response);
                    this.pagseguro.installments = [];
                    reject(response);
                }
            });
        });
    }


    /**
     * Retorna as bandeiras de cartão disponíveis no Pagseguro
     * 
     * @returns {PagseguroOption[]} 
     * @memberof CheckoutCreditCardFormComponent
     */
    PagseguroListBrands(): PagseguroOption[] {
        return this.pagseguro.methods.find(m => m.code == 1).options;
    }

    /**
     * Retorna a imagem da bandeira do cartão do Pagseguro
     * 
     * @param {PagseguroOption} option 
     * @returns {string} 
     * @memberof CheckoutCreditCardFormComponent
     */
    PagseguroBrandImage(option: PagseguroOption): string {
        return `${this.pagseguro_media}${option.images['SMALL'].path}`;
    }

    /**
     * Informa se a bandeira é a selecionada no Pagseguro
     * 
     * @param {PagseguroOption} option 
     * @returns {boolean} 
     * @memberof CheckoutCreditCardFormComponent
     */
    PagseguroIsBrandSelected(option: PagseguroOption): boolean {
        if (this.pagseguro.optionSelected.code == option.code)
            return true;
        else return false;
    }


    /**
     * Retorna o valor da parcela no Pagseguro
     * 
     * @param {number} quantity 
     * @returns {number} 
     * @memberof CheckoutCreditCardFormComponent
     */
    PagseguroGetInstallmentValue(quantity: number): number {
        if (quantity) {
            let installmentAmount: number = this.pagseguro.installments.find(i => i.quantity == quantity).installmentAmount;
            return installmentAmount;
        }
        else return 0;
    }

    /**
     * Retorna o valor à prazo no Pagseguro
     * 
     * @param {number} quantity 
     * @returns {number} 
     * @memberof CheckoutCreditCardFormComponent
     */
    PagseguroGetTotalPurchasePrice(quantity: number): number {
        if (quantity) {
            let totalAmount: number = this.pagseguro.installments.find(i => i.quantity == quantity).totalAmount;
            return totalAmount;
        }
        else return 0;
    }
    /*
    ** MUNDIPAGG
    */

    /**
     * Verifica se o pagamento é Mundipagg
     * 
     * @returns {boolean} 
     * @memberof CheckoutCreditCardFormComponent
     */
    isMundipagg(): boolean {
        return this.manager.isMundiPagg(this.payment);

    }

    /**
     * Retorna as bandeiras dos cartões aceitas na Mundipagg
     * 
     * @returns {PaymentMethod[]} 
     * @memberof CheckoutCreditCardFormComponent
     */
    MundipaggListBrands(): PaymentMethod[] {
        return this.payment.paymentMethods;
    }

    /**
     * Informa se o método é o método selecionado da Mundipagg
     * 
     * @param {PaymentMethod} method 
     * @returns {boolean} 
     * @memberof CheckoutCreditCardFormComponent
     */
    MundipaggIsBrandSelected(method: PaymentMethod): boolean {
        if (this.mundipagg.methodSelected && this.mundipagg.methodSelected.id == method.id)
            return true;
        else return false;
    }

    /**
     * Detecta a bandeira do cartão na Mundipagg
     * 
     * @param {string} cardnumber 
     * @returns {string} 
     * @memberof CheckoutCreditCardFormComponent
     */
    MundipaggDetectCardBrand(cardnumber: string): string {
        let brand: string = null;
        for (let k in this.regexBrands) {
            if (this.regexBrands[k].test(cardnumber.replace(/-/g, ''))) {
                brand = k;
                break;
            }
        }
        return brand;
    }

    /**
     * Obtem o parcelamento do Mundipagg
     * 
     * @param {string} brand 
     * @returns {Promise<PaymentMethod>} 
     * @memberof CheckoutCreditCardFormComponent
     */
    MundipaggGetInstallments(brand: string): Promise<PaymentMethod> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise((resolve, reject) => {
                let cartId: string = localStorage.getItem('cart_id');
                this.manager.simulateInstallmentsByCartId(cartId)
                    .then(payments => {
                        let simulated: Payment = payments.find(p => p.id == this.mundipagg.creditCard.id);
                        let method: PaymentMethod = simulated.paymentMethods.find(m => m.name == this.creditCard.creditCardBrand.toUpperCase());
                        this.mundipaggUpdated.emit(method);
                        resolve(method);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        }
    }

    /**
     * Lista o parcelamento do Mundipagg
     * 
     * @returns {Installment[]} 
     * @memberof CheckoutCreditCardFormComponent
     */
    MundipaggListInstallments(): Installment[] {
        if (this.mundipagg.methodSelected)
            return this.mundipagg.methodSelected.installment;
        else return [];
    }

    /**
     * Formata o valor da parcela para exibição
     * 
     * @param {Installment} installment 
     * @returns {string} 
     * @memberof CheckoutCreditCardFormComponent
     */
    MundipaggInstallmentLabel(installment: Installment): string {
        let price: string = installment.installmentPrice.toFixed(2).toString().replace('.', ',');
        let total: string = installment.totalPrice.toFixed(2).toString().replace('.', ',');
        return `${installment.number}x de R$ ${price} ${installment.description} (R$ ${total})`;
    }

    /**
     * Retorna o valor da parcela no Mundipagg
     * 
     * @param {number} quantity 
     * @returns {number} 
     * @memberof CheckoutCreditCardFormComponent
     */
    MundipaggGetInstallmentValue(quantity: number): number {
        if (quantity) {
            let installmentAmount: number = this.mundipagg.methodSelected.installment.find(i => i.number == quantity).installmentPrice;
            return installmentAmount;
        }
        else return 0;
    }

    /**
     * Retorna o valor à prazo no Pagseguro
     * 
     * @param {number} quantity 
     * @returns {number} 
     * @memberof CheckoutCreditCardFormComponent
     */
    MundipaggGetTotalPurchasePrice(quantity: number): number {
        if (quantity) {
            let totalAmount: number = this.mundipagg.methodSelected.installment.find(i => i.number == quantity).totalPrice;
            return totalAmount;
        }
        else return 0;
    }
}
