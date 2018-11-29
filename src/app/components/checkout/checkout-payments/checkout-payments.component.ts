import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { PaymentManager } from '../../../managers/payment.manager';
import { Payment } from '../../../models/payment/payment';
import { Cart } from '../../../models/cart/cart';
import { EnumShippingType } from '../../../enums/shipping-type.enum';
import { PaymentSelected } from '../../../models/payment/checkout-payment';
import { PaymentMethod } from '../../../models/payment/payment-method';
import { PagseguroMethod } from '../../../models/pagseguro/pagseguro-method';
import { PagseguroOption } from '../../../models/pagseguro/pagseguro-option';
import { PagseguroPayment } from '../../../models/pagseguro/pagseguro';
import { MercadoPagoPayment } from '../../../models/mercadopago/mercadopago';
import { MercadoPagoPaymentMethod } from '../../../models/mercadopago/mercadopago-paymentmethod';
import { CreditCard } from '../../../models/payment/credit-card';
import { MundipaggPayment } from '../../../models/mundipagg/mundipagg';
import { AppCore } from '../../../app.core';

declare var $: any;
declare var swal: any;
declare var PagSeguroDirectPayment: any;
declare var Mercadopago: any;

@Component({
    selector: 'checkout-payments',
    templateUrl: '../../../templates/checkout/checkout-payments/checkout-payments.html',
    styleUrls: ['../../../templates/checkout/checkout-payments/checkout-payments.scss']
})
export class CheckoutPaymentsComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() cart: Cart = null;
    @Input() payments: Payment[] = [];
    @Input() shippingCost: number;
    @Output() paymentUpdated: EventEmitter<PaymentSelected> = new EventEmitter<PaymentSelected>();
    @Output() creditCardUpdated: EventEmitter<CreditCard> = new EventEmitter<CreditCard>();

    listenerOldMethod: PaymentMethod = null;
    listenerOldCrediCard: CreditCard = null;

    payment: Payment = new Payment();
    selected: PaymentSelected = new PaymentSelected();

    pagseguro: PagseguroPayment = new PagseguroPayment();
    mercadopago: MercadoPagoPayment = new MercadoPagoPayment();
    mundipagg: MundipaggPayment = new MundipaggPayment();

    mercadopago_error: string = null;
    mundipagg_error: string = null;
    pagseguro_error: string = null;

    constructor(
        private paymentManager: PaymentManager,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.hasPagseguro()) {
                // Inicia a sessão no Pagseguro
                this.getPagseguroMethods();
            }
            if (this.hasMercadoPago()) {
                // Obtem os métodos de pagamento do Mercado Pago
                this.getMercadoPagoMethods();
            }
            this.getPaymentDefault();
            this.mundipagg.bankslip = this.paymentManager.getMundipaggBankslip(this.payments);
            this.mundipagg.creditCard = this.paymentManager.getMundipaggCreditCard(this.payments);
        }
    }

    getPaymentDefault() {
        if (isPlatformBrowser(this.platformId)) {
            let payment: Payment = this.getDefaultPayment();
            this.selectPayment(payment);
        }
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            $(`#tab-payment-${this.getPaymentNicename(this.payment)}`).collapse();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (isPlatformBrowser(this.platformId)) {
            if (changes['shippingCost'] && !changes.shippingCost.firstChange) {
                if (changes.shippingCost.currentValue != changes.shippingCost.previousValue) {
                    this.resetPayment();
                }
            }
        }
    }

    resetPayment() {
        if (isPlatformBrowser(this.platformId)) {
            this.selected = new PaymentSelected();
            this.pagseguro.optionSelected = new PagseguroOption();
            this.pagseguro.methodSelected = new PagseguroMethod();
            this.mundipagg.methodSelected = new PaymentMethod();
            this.mercadopago.methodSelected = new MercadoPagoPaymentMethod();
            this.emitPayment();
            this.handleCreditCartUpdated(new CreditCard());
            if (isPlatformBrowser(this.platformId)) {
                $('#accordion-payments').collapse('hide');
            }
        }
    }

    /**
     * Retorna o pagamento padrão
     * 
     * @returns {Payment} 
     * @memberof CheckoutPaymentsComponent
     */
    getDefaultPayment(): Payment {
        if (isPlatformBrowser(this.platformId)) {
            const payment: Payment = this.payments.find(p => p.default == true);
            return payment;
        }
    }

    /**
     * Verifica se o pagamento é o pagamento padrão
     * 
     * @param {Payment} payment 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    isDefault(payment: Payment): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (payment.id == this.getDefaultPayment().id)
                return true;
            else return false;
        }
    }

    /**
     * Verifica se o pagamento informado é o pagamento selecionado
     * 
     * @param {Payment} payment 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    isSelected(payment: Payment): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.payment.id == payment.id) {
                if (payment.name.toLowerCase() == 'mundipagg') {
                    if (this.isMundipaggBankslip(payment))
                        return true;
                    else if (this.isMundipaggCreditCard(payment))
                        return true;
                    else return false;
                }
                else return true;
            }
            else return false;
        }
    }

    /**
     * Obtem todas as formas de pagamento disponíveis para a transação
     * 
     * @returns {Payment[]} 
     * @memberof CheckoutPaymentsComponent
     */
    availablePayments(): Payment[] {
        if (isPlatformBrowser(this.platformId)) {
            let pickupStore: Payment = this.paymentManager.getPickUpStorePayment(this.payments);
            let delivery: Payment = this.paymentManager.getDeliveryPayment(this.payments);
            let avaliable = [].concat(this.payments);

            if (!this.isPickUpStoreAvailable() && this.paymentManager.hasPickUpStorePayment(this.payments)) {
                let index = avaliable.findIndex(p => p.id == pickupStore.id);
                avaliable.splice(index, 1);
            }

            if (!this.isDeliveryPaymentAvailable() && this.paymentManager.hasDeliveryPayment(this.payments)) {
                let index = avaliable.findIndex(p => p.id == delivery.id);
                avaliable.splice(index, 1);
            }

            return avaliable;
        }
    }

    /**
     * Cria um nicename para o pagamento
     * 
     * @param {Payment} payment 
     * @returns {string} 
     * @memberof CheckoutPaymentsComponent
     */
    getPaymentNicename(payment: Payment): string {
        if (isPlatformBrowser(this.platformId)) {
            return `${AppCore.getNiceName(payment.name)}${this.isMundipaggBankslip(payment) ? '-bankslip' : ''}-${payment.id}`;
        }
    }

    /**
     * 
     * 
     * @param {Payment} payment 
     * @returns {string} 
     * @memberof CheckoutPaymentsComponent
     */
    getPaymentLabel(payment: Payment): string {
        if (isPlatformBrowser(this.platformId)) {
            if (this.isMundipaggBankslip(payment))
                return 'Boleto';
            else if (this.isMundipaggCreditCard(payment))
                return 'Cartão de Crédito';
            else return payment.name;
        }
    }

    /**
     * Seleciona o pagamento
     * 
     * @param {Payment} payment 
     * @memberof CheckoutPaymentsComponent
     */
    selectPayment(payment: Payment, event = null) {
        if (isPlatformBrowser(this.platformId)) {
            if (event)
                event.preventDefault();

            this.payment = payment;
            this.selected.payment = payment;
            this.selected.method = this.listenerOldMethod;

            if (this.isMundipaggBankslip(payment))
                this.selectMundipaggMethod(payment.paymentMethods[0]);

            this.emitPayment();
        }
    }

    /**
     * Emite o pagamento selecionado para o componente-pai pelo Output
     * 
     * @memberof CheckoutPaymentsComponent
     */
    emitPayment() {
        if (isPlatformBrowser(this.platformId)) {
            this.handleCreditCartUpdated(new CreditCard());
            this.paymentUpdated.emit(this.selected);
        }
    }

    /**
     * Desabilia a ação padrão do evento
     * 
     * @param {any} [event=null] 
     * @memberof CheckoutPaymentsComponent
     */
    preventDefault(event = null) {
        if (isPlatformBrowser(this.platformId)) {
            if (event)
                event.preventDefault();
        }
    }

    /**
     * Recebe o cartão de crédito do CheckoutCreditCardFormComponent e emite ao CheckoutComponent
     * 
     * @param {CreditCard} event 
     * @memberof CheckoutPaymentsComponent
     */
    handleCreditCartUpdated(event: CreditCard) {
        if (isPlatformBrowser(this.platformId)) {
            if (event.payment)
                this.listenerOldCrediCard = event;
            if (this.listenerOldCrediCard)
                this.creditCardUpdated.emit(this.listenerOldCrediCard);
            else
                this.creditCardUpdated.emit(event);
        }
    }

    /**
     * Recebe a opção selecionada do Pagseguro e adiciona à varíavel
     * 
     * @param {PagseguroOption} event 
     * @memberof CheckoutPaymentsComponent
     */
    handlePagseguroUpdated(event: PagseguroOption) {
        if (isPlatformBrowser(this.platformId)) {
            this.selectPagseguroOption(null, event);
        }
    }

    /**
     * Recebe o método selecionado do Mundipagg e adiciona à variável
     * 
     * @param {PaymentMethod} event 
     * @memberof CheckoutPaymentsComponent
     */
    handleMundipaggUpdated(event: PaymentMethod) {
        if (isPlatformBrowser(this.platformId)) {
            this.selected.method = event;
            this.listenerOldMethod = event;
            this.emitPayment();
        }
    }

    /**
     * Recebe o método selecionado do Mercado Pago e adiciona à variável
     * 
     * @param {MercadoPagoPaymentMethod} event 
     * @memberof CheckoutPaymentsComponent
     */
    handleMercadoPagoUpdated(event: MercadoPagoPaymentMethod) {
        if (isPlatformBrowser(this.platformId)) {
            this.selected.mercadopago = event;
            this.emitPayment();
        }
    }

    /**
     * Informa se o pagamento na loja está disponível
     * 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    isPickUpStoreAvailable(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            let cart: Cart = this.cart;
            if (cart.shipping && cart.shipping.shippingType == EnumShippingType.PickuUpStore)
                return true;
            else
                return false;
        }
    }

    /**
     * Informa se o pagamento na entrega está disponível
     * 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    isDeliveryPaymentAvailable(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            // TODO: Habilitar o pagamento na entrega e transportadoras próprias da Intelipost
            return false;
        }
    }

    /**
     * Informa se o pagamento selecionado é Pagseguro
     * 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    isPagseguro(payment: Payment = null): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return this.paymentManager.isPagSeguro((payment) ? payment : this.payment, this.payments);
        }
    }

    /**
     * Informa se o pagamento selecionado é Pagamento na Loja
     * 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    isPickupStore(payment: Payment = null): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return this.paymentManager.isPickUpStorePayment((payment) ? payment : this.payment, this.payments);
        }
    }

    /**
     * Informa se o pagamento selecionado é Mercado Pago
     * 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    isMercadoPago(payment: Payment = null): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return this.paymentManager.isMercadoPago((payment) ? payment : this.payment, this.payments);
        }
    }

    /**
     * Informa se o Pagseguro está habilitado na loja
     * 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    hasPagseguro(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return this.paymentManager.hasPagSeguro(this.payments);
        }
    }

    /**
     * 
     * 
     * @param {any} [event=null] 
     * @memberof CheckoutPaymentsComponent
     */
    getPagseguroMethods(event = null) {
        if (isPlatformBrowser(this.platformId)) {
            if (event)
                event.preventDefault();
            this.createPagseguroSession();
        }
    }

    /**
     * Cria uma sessão no Pagseguro e obtem os métodos de pagamento
     * 
     * @memberof CheckoutPaymentsComponent
     */
    createPagseguroSession() {
        if (isPlatformBrowser(this.platformId)) {
            this.pagseguro_error = null;
            this.paymentManager.createPagSeguroSession()
                .subscribe(session => {
                    this.pagseguro = new PagseguroPayment();
                    this.pagseguro.session = session;
                    let totalPurchasePrice: number = this.cart.totalPurchasePrice;
                    PagSeguroDirectPayment.setSessionId(this.pagseguro.session);
                    // this.loaderService.start();
                    PagSeguroDirectPayment.getPaymentMethods({
                        amount: totalPurchasePrice,
                        success: response => {
                            for (let k in response.paymentMethods) {
                                this.pagseguro.methods.push(new PagseguroMethod(response.paymentMethods[k]));
                            }
                            if (this.pagseguro.methods.length == 0) {
                                swal('Erro ao obter as formas de pagamento', 'Falha ao obter as formas de pagamento do Pagseguro', 'error');
                            }
                        },
                        error: response => {
                            this.pagseguro_error = 'Não foi possível obter as formas de pagamento do Pagseguro';
                            swal('Erro ao obter as formas de pagamento', 'Falha ao obter as formas de pagamento do Pagseguro', 'error');
                        }
                    });
                }, err => {
                    this.pagseguro_error = 'Não foi possível obter as formas de pagamento do Pagseguro';
                    throw new Error(`${err.error} Status: ${err.status}`);
                    // let message: string = (err.status != 0) ? err.error : '';
                    // this.pagseguro_error = 'Não foi possível obter as formas de pagamento do Pagseguro';
                    // swal({
                    //     title: 'Erro ao criar a sessão no Pagseguro',
                    //     text: message,
                    //     type: 'error',
                    //     showCancelButton: true,
                    //     confirmButtonColor: '#3085d6',
                    //     cancelButtonColor: '#d33',
                    //     confirmButtonText: 'Tentar novamente'
                    // }).then(() => {
                    //     this.createPagseguroSession();
                    // });
                });
        }
    }

    /**
     * Retorna os métodos de pagamento do Pagseguro disponíveis
     * 
     * @returns {PagseguroMethod[]} 
     * @memberof CheckoutPaymentsComponent
     */
    availablePagseguroMethods(): PagseguroMethod[] {
        if (isPlatformBrowser(this.platformId)) {
            if (this.pagseguro.methods)
                return this.pagseguro.methods.filter(m => m.code == 1 || m.code == 2);
            else
                return [];
        }
    }

    /**
     * Informa se o método do Pagseguro é o que está selecionado
     * 
     * @param {PagseguroMethod} methodType 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    isPagseguroMethodSelected(methodType: PagseguroMethod): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.pagseguro.methodSelected.code == methodType.code)
                return true;
            else return false;
        }
    }

    /**
     * Informa se o método selecionado no Pagseguro é cartão
     * 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    isPagseguroCreditCard(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.pagseguro.methodSelected)
                if (this.pagseguro.methodSelected.code == 1)
                    return true;
                else return false;
            else return false;
        }
    }

    /**
     * Seleciona o método de pagamento no Pagseguro
     * 
     * @param {PagseguroMethod} methodType 
     * @param {any} [event=null] 
     * @memberof CheckoutPaymentsComponent
     */
    selectPagseguroMethod(methodType: PagseguroMethod, event = null) {
        if (isPlatformBrowser(this.platformId)) {
            this.preventDefault(event);

            this.pagseguro.methodSelected = methodType;
            if (methodType.code == 2) //Se for boleto
                this.selectPagseguroOption(null, methodType.options[0]);
            else
                this.selectPagseguroOption(null, new PagseguroOption());
        }
    }

    /**
     * Seleciona a opção do método do Pagseguro
     * 
     * @param {any} [event=null] 
     * @param {PagseguroOption} option 
     * @memberof CheckoutPaymentsComponent
     */
    selectPagseguroOption(event = null, option: PagseguroOption) {
        if (isPlatformBrowser(this.platformId)) {
            this.preventDefault(event);

            this.pagseguro.optionSelected = option;
            this.selected = new PaymentSelected(this.payment, null, this.pagseguro.optionSelected);

            this.emitPayment();
        }
    }

    /**
     * Obtem as formas de pagamento do Mercado Pago e cria a sessão
     * 
     * @param {any} [event=null] 
     * @memberof CheckoutPaymentsComponent
     */
    getMercadoPagoMethods(event = null) {
        if (isPlatformBrowser(this.platformId)) {
            this.mercadopago_error = null;

            if (event)
                event.preventDefault();

            // Obtem os métodos de pagamento do Mercado Pago
            this.paymentManager.getMercadoPagoMethods()
                .subscribe(response => {
                    this.mercadopago.methods = response.filter(m => m.status == 'active');
                }, err => {
                    this.mercadopago_error = 'Erro ao obter as formas de pagamento do Mercado Pago';
                });

            // Obtem a public_key do Mercado Pago e instancia a mesma
            this.paymentManager.getMercadoPagoPublicKey()
                .subscribe(value => {
                    this.mercadopago.public_key = value;
                    Mercadopago.setPublishableKey(this.mercadopago.public_key);
                },error => {
                    throw new Error(`${error.error} Status: ${error.status}`);
                }
            );
        }
    }

    /**
     * Informa se o Mercado Pago está habilitado na loja
     * 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    hasMercadoPago(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return this.paymentManager.hasMercadoPago(this.payments);
        }
    }

    /**
     * Informa se há cartões de crédito habilitados como pagamento no Mercado Pago
     * 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    hasMercadoPagoCreditCards(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.mercadopago.methods.filter(m => m.payment_type_id == "credit_card").length > 0)
                return true;
            else return false;
        }
    }

    /**
     * Obtem o boleto do Mercado Pago
     * 
     * @returns {MercadoPagoPaymentMethod} 
     * @memberof CheckoutPaymentsComponent
     */
    getMercadoPagoTicket(): MercadoPagoPaymentMethod {
        if (isPlatformBrowser(this.platformId)) {
            return this.mercadopago.methods.filter(m => m.payment_type_id == 'ticket')[0];
        }
    }

    /**
     * Informa se o método selecionado é boleto do Mercado Pago
     * 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    isMercadoPagoTicket(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.mercadopago.methodSelected && this.mercadopago.methodSelected.payment_type_id == 'ticket')
                return true;
            else return false;
        }
    }

    /**
     * Informa se o método selecionado é cartão de crédito do Mercado Pago
     * 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    isMercadoPagoCreditCard(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.mercadopago.methodSelected && this.mercadopago.methodSelected.payment_type_id == 'credit_card')
                return true;
            else return false;
        }
    }

    /**
     * 
     * 
     * @param {MercadoPagoPaymentMethod} method 
     * @memberof CheckoutPaymentsComponent
     */
    selectMercadoPagoMethod(method: MercadoPagoPaymentMethod, event = null) {
        if (isPlatformBrowser(this.platformId)) {
            this.preventDefault(event);
            this.mercadopago.methodSelected = method;
            this.selected = new PaymentSelected(this.payment, null, null, this.mercadopago.methodSelected);

            if (this.isMercadoPagoCreditCard()) {
                this.selected.valid = false;
            }

            this.handleCreditCartUpdated(new CreditCard());
            this.emitPayment()
        }
    }

    /**
     * Identifica se o pagamento é Mundipagg Boleto
     * 
     * @param {Payment} [payment=null] 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    isMundipaggBankslip(payment: Payment = null): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (!payment)
                payment = this.selected.payment;
            return this.paymentManager.isMundipaggBankslip(payment, this.payments);
        }
    }

    /**
     * Identifica se o pagamento é Mundipagg cartão de crédito
     * 
     * @param {Payment} [payment=null] 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    isMundipaggCreditCard(payment: Payment = null): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (!payment)
                payment = this.selected.payment;
            return this.paymentManager.isMundipaggCreditCard(payment, this.payments);
        }
    }

    /**
     * Informa se o método do Mundipagg está selecionado
     * 
     * @param {PaymentMethod} method 
     * @returns {boolean} 
     * @memberof CheckoutPaymentsComponent
     */
    isMundiPaggMethodSelected(method: PaymentMethod): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.selected.method && this.selected.method.id == method.id)
                return true;
            else return false;
        }
    }

    /**
     * Seleciona o método de pagamento do Mundipagg
     * 
     * @param {PaymentMethod} method 
     * @param {any} [event=null] 
     * @memberof CheckoutPaymentsComponent
     */
    selectMundipaggMethod(method: PaymentMethod, event = null) {
        if (isPlatformBrowser(this.platformId)) {
            this.preventDefault(event);
            this.payment = this.paymentManager.getMundipagg(this.payments)[0];
            this.selected.method = method;
            this.selected = new PaymentSelected(this.payment, method);
            this.emitPayment();
        }
    }
}
