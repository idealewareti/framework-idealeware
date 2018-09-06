import { Component, OnInit, PLATFORM_ID, Inject, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Cart } from '../../../models/cart/cart';
import { Customer } from '../../../models/customer/customer';
import { CustomerAddress } from '../../../models/customer/customer-address';
import { Shipping } from '../../../models/shipping/shipping';
import { Payment } from '../../../models/payment/payment';
import { AppTexts } from '../../../app.texts';
import { CreditCard } from '../../../models/payment/credit-card';
import { PaymentMethod } from '../../../models/payment/payment-method';
import { Branch } from '../../../models/branch/branch';
import { ActivatedRoute, Router } from '@angular/router';
import { CartManager } from '../../../managers/cart.manager';
import { PaymentManager } from '../../../managers/payment.manager';
import { Store } from '../../../models/store/store';
import { PaymentSelected } from '../../../models/payment/checkout-payment';
import { Order } from '../../../models/order/order';
import { PagseguroCreditCard } from '../../../models/pagseguro/pagseguro-card';
import { MercadoPagoCreditCard } from '../../../models/mercadopago/mercadopago-creditcard';
import { Token } from '../../../models/customer/token';
import { AppCore } from '../../../app.core';
import { AppConfig } from '../../../app.config';
import { CartItem } from '../../../models/cart/cart-item';
import { OrderManager } from '../../../managers/order.manager';
import { CustomerManager } from '../../../managers/customer.manager';

declare var swal: any;
declare var toastr: any;
declare var PagSeguroDirectPayment: any;
declare var Mercadopago: any;
declare var $: any;

@Component({
    selector: 'checkout',
    templateUrl: '../../../templates/checkout/checkout/checkout.html',
    styleUrls: ['../../../templates/checkout/checkout/checkout.scss']
})
export class CheckoutComponent implements OnInit {
    customer: Customer;
    payments: Payment[];
    cart: Cart;
    store: Store;
    stateProcessCheckout: boolean = false;

    private shippingSelected: Shipping = null;
    private token: string;

    mediaPath: string;
    mediaPathPayments: string;
    readonly paymentMethodTypes = AppTexts.PAYMENT_METHOD_TYPES;

    billingAddress: CustomerAddress;
    shippingAddress: CustomerAddress;
    availableMethodTypes = [];
    creditCard: CreditCard = new CreditCard();
    paymentSelected: PaymentSelected = new PaymentSelected();
    methodSelected: PaymentMethod = new PaymentMethod();
    branches: Branch[] = [];
    changeFor: number = null;
    defaultPayment: Payment;
    @ViewChild('scriptContainer') scriptContainer: ElementRef;
    kondutoScript: HTMLElement;
    kondutoScriptId = 'konduto-event-script';
    kondutoIdentified: boolean = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private cartManager: CartManager,
        private paymentManager: PaymentManager,
        private orderManager: OrderManager,
        private customerManager: CustomerManager,
        private parentRouter: Router,
        private renderer: Renderer2,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.getStore();
            this.getCart();
            this.getPayments();
            this.getCustomer();
        }
    }

    getStore(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.store = this.activatedRoute.snapshot.data.store;
            this.mediaPath = `${this.store.link}/static/products/`;
            this.mediaPathPayments = `${this.store.link}/static/payments/`;
        }
    }

    getCart(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.cartManager.getCart()
                .subscribe(cart => {
                    this.cart = cart;
                    this.shippingAddress = cart.deliveryAddress;
                    this.billingAddress = cart.billingAddress;
                });
        }
    }

    getPayments(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.payments = this.activatedRoute.snapshot.data.payments;
            this.methodSelected = null;
            this.createPagseguroSession();
        }
    }

    getCustomer(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.customer = this.activatedRoute.snapshot.data.customer;
            this.cartManager.setCustomerToCart()
                .subscribe(cart => this.cart = cart);
        }
    }

    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.kondutoIdentified) {
                this.kondutoIdentified = true;
                customer => this.injectKondutoIdentifier(customer.email)
            }
        }
    }

    ngOnDestroy() {
        if (isPlatformBrowser(this.platformId)) {
            let script = document.getElementById(this.kondutoScriptId);
            if (script) {
                this.renderer.removeChild(this.scriptContainer, this.kondutoScript);
            }
        }
    }

    private injectKondutoIdentifier(id: string): void {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.isKondutoActived()) {
                return;
            }

            let script = this.renderer.createElement('script');
            this.renderer.setAttribute(script, 'id', this.kondutoScriptId);
            const content = `
            var customerID = "${id}"; // define o ID do cliente 
            (function () {
                var period = 300;
                var limit = 20 * 1e3;
                var nTry = 0;
                var intervalID = setInterval(function () { // loop para retentar o envio         
                    var clear = limit / period <= ++nTry;
                    if ((typeof (Konduto) !== "undefined") &&
                        (typeof (Konduto.setCustomerID) !== "undefined")) {
                        window.Konduto.setCustomerID(customerID); // envia o ID para a Konduto             
                        clear = true;
                    }
                    if (clear) {
                        clearInterval(intervalID);
                    }
                }, period);
            })(customerID);
        `

            script.innerHTML = content;
            this.renderer.appendChild(this.scriptContainer.nativeElement, script);
        }
    }

    private isKondutoActived(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppConfig.KONDUTO;
        }
    }

    /**
     * Verifica se a loja possui pagseguro
     * @returns {boolean} 
     * @memberof AppComponent
     */
    hasPagSeguro(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return this.paymentManager.hasPagSeguro(this.payments);
        }
    }

    /**
     * Cria a sessão no pagseguro e armazena no Local Storage
     * @memberof AppComponent
     */
    createPagseguroSession() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.hasPagSeguro()) {
                return;
            }

            let token: Token = this.customerManager.getToken();

            if (isPlatformBrowser(this.platformId)) {
                if (token)
                    this.paymentManager.createPagSeguroSession()
                        .subscribe(sessionId => {
                            this.paymentManager.setPagSeguroSession(sessionId);
                        }, err => {
                            console.log(err);
                        });
                else
                    this.paymentManager.createPagSeguroSessionSimulator()
                        .subscribe(sessionId => {
                            this.paymentManager.setPagSeguroSession(sessionId);
                        });
            }
        }
    }

    /**
     * 
     * Obtem o valor de desconto total do carrinho
     * @returns {number} 
     * @memberof CheckoutComponent
     */
    getDiscount(): number {
        if (isPlatformBrowser(this.platformId)) {
            return this.cart.totalDiscountPrice;
        }
    }

    /**
     * Obtem o valor de frete do carrinho
     * 
     * @returns {number} 
     * @memberof CheckoutComponent
     */
    getShipping(): number {
        if (isPlatformBrowser(this.platformId)) {
            return this.cart.totalFreightPrice;
        }
    }

    /**
     * Obtem o subtotal da compra do carrinho
     * 
     * @returns 
     * @memberof CheckoutComponent
     */
    getSubTotal() {
        if (isPlatformBrowser(this.platformId)) {
            return this.cart.totalProductsPrice + this.cart.totalServicesPrice;
        }
    }

    /**
     * Obtem o valor total da compra do carrinho
     * 
     * @returns {number} 
     * @memberof CheckoutComponent
     */
    getTotal(): number {
        if (isPlatformBrowser(this.platformId)) {
            if (this.isMundipaggBankslip() && this.methodSelected && this.methodSelected.discount > 0) {
                return this.cart.totalPurchasePrice - (this.cart.totalPurchasePrice * (this.methodSelected.discount / 100));
            }
            return this.cart.totalPurchasePrice;
        }
    }

    /**
     * Obtem o valor total parcelado
     * 
     * @returns {number} 
     * @memberof CheckoutComponent
     */
    getTotalCreditCard(): number {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.creditCard.totalPurchasePrice)
                return 0;
            else if (this.creditCard.totalPurchasePrice != this.cart.totalPurchasePrice)
                return this.creditCard.totalPurchasePrice;
            else return 0;
        }
    }

    /**
     * Obtem o valor total de serviços do carrinho
     * 
     * @returns {number} 
     * @memberof CheckoutComponent
     */
    getTotalServices(): number {
        if (isPlatformBrowser(this.platformId)) {
            return this.cart.totalServicesPrice;
        }
    }

    /**
     * Obtem o método de pagamento selecionado
     * 
     * @returns {PaymentMethod} 
     * @memberof CheckoutComponent
     */
    getPaymentTypeSelected(): PaymentMethod {
        if (isPlatformBrowser(this.platformId)) {
            if (this.isPagSeguro()) {
                this.methodSelected = new PaymentMethod();
                if (this.paymentSelected.pagseguro)
                    this.methodSelected.name = (this.paymentSelected.pagseguro.name) ? this.paymentSelected.pagseguro.name : this.creditCard.creditCardBrand;
            }
            else if (this.isMercadoPago()) {
                this.methodSelected = new PaymentMethod();
                if (this.paymentSelected.mercadopago)
                    this.methodSelected.name = (this.paymentSelected.mercadopago.payment_type_id == 'ticket') ? this.paymentSelected.mercadopago.name : this.creditCard.creditCardBrand;
            }
            else if (this.paymentSelected && this.isPickUpStorePayment(this.paymentSelected.payment)) {
                this.methodSelected.name = 'Pagamento na Loja';
            }
            else if (this.isMundipaggBankslip()) {
                this.methodSelected = this.paymentSelected.method;
            }
            else if (this.isMundipaggCreditCard()) {
                this.methodSelected = this.paymentSelected.method;
            }
            else this.methodSelected = new PaymentMethod();

            return this.methodSelected;
        }
    }

    /**
     * Retorna o total de itens no carrinho
     * 
     * @returns {number} 
     * @memberof CheckoutComponent
     */
    getNumItemsInCart(): number {
        if (isPlatformBrowser(this.platformId)) {
            if (this.cart) {
                let numItems = 0;
                numItems += (this.cart.products) ? this.cart.products.length : 0;
                numItems += (this.cart.services) ? this.cart.services.length : 0;
                return numItems;
            }
            else return 0;
        }
    }

    /**
     * Retorna o endereço de entrega selecionado
     * 
     * @returns {CustomerAddress} 
     * @memberof CheckoutComponent
     */
    getDeliveryAddress(): CustomerAddress {
        if (isPlatformBrowser(this.platformId)) {
            return this.cart.deliveryAddress;
        }
    }

    /*
    ** Handlers
    */
    /**
     * Obtem o pagamento selecionado
     * 
     * @param {PaymentSelected} paymentSelected 
     * @memberof CheckoutComponent
     */
    handlePaymentUpdated(paymentSelected: PaymentSelected) {
        if (isPlatformBrowser(this.platformId)) {
            this.paymentSelected = paymentSelected;
            this.getTotal();
        }
    }

    /**
     * Obtem o frete selecionado
     * 
     * @param {Shipping} shipping 
     * @memberof CheckoutComponent
     */
    handleShippingUpdated(shipping: Shipping) {
        if (isPlatformBrowser(this.platformId)) {
            this.shippingSelected = shipping;
        }
    }

    handleCreditCardUpdated(event: CreditCard) {
        if (isPlatformBrowser(this.platformId)) {
            this.creditCard = event;
        }
    }
    /*
    ** Validators
    */
    /**
     * Verifica se está em um dispositivo móvel
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }

    isHiddenVariation(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            let type = this.store.settings.find(s => s.type == 4);
            if (type)
                return type.status;
            else
                return false;
        }
    }

    /**
     * Verifica se o carrinho está vazio
     * 
     * @param {Cart} cart 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isCartEmpty(cart: Cart): boolean {
        if (isPlatformBrowser(this.platformId)) {
            let empty = false;

            if ((cart.products == null || cart.products.length < 1) &&
                (cart.services == null || cart.services.length < 1))
                empty = true;

            return empty;
        }
    }

    /**
    * Verifica se o pagamento selecionado é Pagseguro
    * 
    * @returns {boolean} 
    * @memberof CheckoutComponent
    */
    isPagSeguro(payment: Payment = null): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (!payment)
                payment = this.paymentSelected.payment;
            return this.paymentManager.isPagSeguro(payment, this.payments);
        }
    }

    /**
     * Verifica se o pagamento selecionado é MercadoPago
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isMercadoPago(paymentSelected: Payment = null): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (!paymentSelected)
                paymentSelected = this.paymentSelected.payment;
            return this.paymentManager.isMercadoPago(paymentSelected, this.payments);
        }
    }

    /**
     * Verifica se o pagamento selecionado é pagamento na entrega
     * 
     * @param {Payment} payment 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isDeliveryPayment(payment: Payment): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return this.paymentManager.isDeliveryPayment(payment, this.payments);
        }
    }

    /**
     * Verifica se o pagamento selecionado é Boleto Mundipagg
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isMundipaggBankslip(paymentSelected: Payment = null): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (!paymentSelected)
                paymentSelected = this.paymentSelected.payment;
            return this.paymentManager.isMundipaggBankslip(paymentSelected, this.payments);
        }
    }

    /**
     * Verifica se o pagamento selecionado é Mundipagg (Cartão de Crédito)
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isMundipaggCreditCard(paymentSelected: Payment = null): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (!paymentSelected)
                paymentSelected = this.paymentSelected.payment;
            return this.paymentManager.isMundipaggCreditCard(paymentSelected, this.payments);
        }
    }

    /**
     * Verifica se o pagamento selecionado é Pagamento na Loja (Pickup Store)
     * 
     * @param {Payment} payment 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isPickUpStorePayment(payment: Payment): boolean {
        if (isPlatformBrowser(this.platformId)) {
            let pickUpStore: Payment = this.paymentManager.getPickUpStorePayment(this.payments);
            if (pickUpStore && payment && payment.id == pickUpStore.id)
                return true;
            else return false;
        }
    }

    /**
     * Valida se o carrinho já possui frete selecionado
     * 
     * @param {string} cartId 
     * @returns {boolean} 
     * 
     * @memberof CheckoutComponent
     */
    hasShippingSelected(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.shippingSelected || this.shippingSelected.shippingType == 0)
                return false;
            else return true;
        }
    }

    /**
     * Valida se o carrinho já possui meio de pagamento selecionado
     * 
     * @param {string} cartId 
     * @returns {boolean} 
     * 
     * @memberof CheckoutComponent
     */
    hasPaymentMethodSelected(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if ((this.paymentSelected.method && this.paymentSelected.method['id'])
                || this.paymentSelected.pagseguro
                || this.paymentSelected.mercadopago
                || this.isPickUpStorePayment(this.paymentSelected.payment)
            )
                return true;
            else return false;
        }
    }
    /**
     * Informa se há endereço de entrega selecionado
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    hasDeliveryAddress(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            let address = this.getDeliveryAddress();
            if (address && address.id)
                return true;
            else return false;
        }
    }

    /**
     * Verifica se o troco selecionado (Delivery Payment) é válido
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    validChangeFor(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            let isValid = true;
            if (this.methodSelected.type == 3) {
                if (this.changeFor && this.changeFor <= this.cart.totalPurchasePrice) {
                    isValid = false;
                }
            }

            return isValid;
        }
    }

    /**
     * Valida se o checkout está OK para gerar o pedido
     * 
     * @returns {boolean} 
     * 
     * @memberof CheckoutComponent
     */
    checkoutIsValid(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            let title = '';
            let message = '';
            let valid = true;
            let cartId = localStorage.getItem('cart_id');
            let type = '';

            if (!this.hasShippingSelected()) {
                title = 'Opção de entrega não selecionada';
                message = 'Selecione uma opção de entrega';
                type = 'warning';
                valid = false;
            }
            else if (!this.hasPaymentMethodSelected()) {
                title = 'Forma de pagamento não selecionada';
                message = 'Selecione uma forma de pagamento';
                type = 'warning';
                valid = false;
            }

            else if (!this.getPaymentTypeSelected() && !this.getPaymentTypeSelected().name) {
                title = 'Nenhuma forma de pagamento selecionada';
                message = 'Não foi possível realizar o pedido';
                type = 'error';
                valid = false;
            }

            if (!valid) {
                swal(title, message, type);
            }

            return valid;
        }
        else
            return false;
    }

    /*
    ** Checkout
    */
    /**
     * Inicia o processo de compra
     * 
     * @param {any} event 
     * @returns 
     * @memberof CheckoutComponent
     */
    placeOrder(event) {
        if (isPlatformBrowser(this.platformId)) {
            event.preventDefault();
            $('#btn_place-order').button('loading');
            this.stateProcessCheckout = true;

            if (!this.checkoutIsValid()) {
                $('#btn_place-order').button('reset');
                this.stateProcessCheckout = false;
                return;
            }

            if (!this.validChangeFor()) {
                swal('Valor inválido', 'O valor para troco deve ser maior do que o valor total da compra', 'warning');
                $('#btn_place-order').button('reset');
                this.stateProcessCheckout = false;
                return;
            }

            /* Pagamento Offline */
            if (this.paymentSelected.payment.type == 2) {
                this.payWithOfflineMethod();
            }
            /* Pagamento com cartão de crédito mundipagg */
            else if (this.isMundipaggCreditCard()) {
                this.payWithMundipaggCreditCard();
            }
            /* Pagamento com boleto mundipagg */
            else if (this.isMundipaggBankslip()) {
                this.payWithMundipaggBankslip();
            }
            /* Pagamento boleto pagseguro */
            else if (this.isPagSeguro() && this.paymentSelected.pagseguro.code == 202) {
                this.payWithPagseguroBankSlip();
            }
            /* Pagamento cartão de crédito pagseguro */
            else if (this.isPagSeguro() && this.paymentSelected.pagseguro.code >= 100 && this.paymentSelected.pagseguro.code <= 199) {
                this.payWithPagseguroCreditCard();
            }
            /* Pagamento boleto mercado pago */
            else if (this.isMercadoPago() && this.paymentSelected.mercadopago.payment_type_id == 'ticket') {
                this.payWithMercadoPagoBankSlip();
            }
            /* Pagamento cartão de crédito mercado pago */
            else if (this.isMercadoPago() && this.paymentSelected.mercadopago.payment_type_id == 'credit_card') {
                this.payWithMercadoPagoCreditCard();
            }
            else {
                swal('Não foi possível realizar o pedido', 'Nenhuma forma de pagamento selecionada', 'error');
                $('#btn_place-order').button('reset');
                this.stateProcessCheckout = false;
            }
            // });
        }
    }

    /**
     * Finaliza a compra
     * 
     * @param {Order} order 
     * @memberof CheckoutComponent
     */
    finish(order: Order) {
        if (isPlatformBrowser(this.platformId)) {
            $('#btn_place-order').button('reset');
            this.stateProcessCheckout = false;
            toastr['success']('Pedido realizado com sucesso!');
            this.cartManager.removeCart();
            this.parentRouter.navigateByUrl(`/checkout/concluido/${order.id}`);
        }
    }

    /**
     * Pagamento com um método offline
     * 
     * @private
     * @param {string} cartId 
     * @memberof CheckoutComponent
     */
    private payWithOfflineMethod() {
        if (isPlatformBrowser(this.platformId)) {
            toastr['info']('Aguarde, validando seu pedido...');
            this.validateOrder()
                .then(cart => {
                    toastr['success']('Pedido validado. Processando informações de pagamento..');
                    let paymentRef = this.paymentSelected.payment.name.toLowerCase();
                    if (paymentRef == 'pagamento na loja') {
                        return this.pickUpStoreTransaction();
                    }
                    else if (paymentRef = 'pagamento na entrega') {
                        return this.delivertPayment();
                    }
                })
                .then(response => {
                    toastr['success']('Pagamento confirmado. Realizando pedido...');
                    return this.placeOrderApi();
                })
                .then(order => {
                    this.finish(order);
                })
                .catch(err => {
                    console.log(err);
                    swal('Erro ao criar o pedido', err.error, 'error');
                    $('#btn_place-order').button('reset');
                    this.stateProcessCheckout = false;
                });
        }
    }

    private pickUpStoreTransaction(): Promise<string> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise(resolve => {
                this.paymentManager.pickUpStoreTransaction()
                    .subscribe(str => resolve(str));
            });
        }
    }

    private delivertPayment(): Promise<string> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise(resolve => {
                this.paymentManager.delivertPayment()
                    .subscribe(str => resolve(str))
            });
        }
    }

    /**
     * Pagamento com Boleto Pagseguro
     * 
     * @private
     * @memberof CheckoutComponent
     */
    private payWithPagseguroBankSlip() {
        if (isPlatformBrowser(this.platformId)) {
            toastr['info']('Aguarde, validando seu pedido...');
            let hash = PagSeguroDirectPayment.getSenderHash();
            this.validateOrder()
                .then(cart => {
                    toastr['success']('Pedido validado. Processando informações de pagamento..');
                    return this.PagseguroBankSlip(hash);
                })
                .then(response => {
                    toastr['success']('Pagamento confirmado. Realizando pedido...');
                    return this.placeOrderApi();
                })
                .then(order => {
                    this.finish(order);
                })
                .catch(err => {
                    console.log(err);
                    swal('Erro ao criar o pedido', err.error, 'error');
                    $('#btn_place-order').button('reset');
                    this.stateProcessCheckout = false;
                });
        }
    }

    private PagseguroBankSlip(hash): Promise<string> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise(resolve => {
                this.paymentManager.PagseguroBankSlip(hash)
                    .subscribe(str => resolve(str))
            })
        }
    }

    /**
     * Pagamento com Cartão de Crédito Pagseguro
     * 
     * @private
     * @param {string} cartId 
     * @memberof CheckoutComponent
     */
    private payWithPagseguroCreditCard() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.paymentManager.isCardOK(this.creditCard)) {
                swal('Erro', 'Verifique os dados do cartão', 'error');
                $('#btn_place-order').button('reset');
                this.stateProcessCheckout = false;
                return;
            }
            toastr['info']('Criando a sessão no Pagseguro...');
            this.paymentManager.createPagSeguroSession()
                .subscribe(session => {
                    toastr['success']('Sessão no Pagseguro criada');
                    PagSeguroDirectPayment.setSessionId(session);
                    toastr['info']('Aguarde, validando seu pedido...');
                    let hash = PagSeguroDirectPayment.getSenderHash();
                    PagSeguroDirectPayment.createCardToken({
                        cardNumber: this.creditCard.creditCardNumber.replace(/-/g, ''),
                        cvv: this.creditCard.securityCode,
                        expirationMonth: this.creditCard.expMonth,
                        expirationYear: this.creditCard.expYear,
                        success: response => {
                            this.token = response.card.token
                            this.validateOrder()
                                .then(cart => {
                                    toastr['success']('Pedido validado. Processando informações de pagamento..');
                                    let creditCard = new PagseguroCreditCard();
                                    creditCard.creditCardToken = this.token;
                                    creditCard.holderName = this.creditCard.holderName;
                                    creditCard.cpf = this.creditCard.taxId.replace(/\D/g, '');
                                    creditCard.birthDate = this.creditCard.birthDate;
                                    creditCard.phone = this.creditCard.phone.replace(/\D/g, '');
                                    creditCard.installmentQuantity = this.creditCard.installmentCount;

                                    creditCard.installmentValue = this.creditCard.installmentValue;
                                    creditCard.noInterestInstallmentQuantity = Number.parseInt(this.paymentSelected.payment.settings.find(s => s.name == ("NoInterestInstallmentQuantity")).value);
                                    return this.PagseguroCreditCard(hash, creditCard);
                                })
                                .then(response => {
                                    toastr['success']('Pagamento confirmado. Realizando pedido...');
                                    return this.placeOrderApi();
                                })
                                .then(order => {
                                    this.finish(order);
                                })
                                .catch(err => {
                                    console.log(err);
                                    let message = (err.status != 0) ? err.error.replace(/"/g, '') : 'Erro ao finalizar a compra com o Pagseguro';
                                    swal('Erro ao criar o pedido', (message.split('|')[1]) ? message.split('|')[1] : message, 'error');

                                    $('#btn_place-order').button('reset');
                                    this.stateProcessCheckout = false;
                                });
                        }, error: response => {
                            console.log(response);
                            let message: string;
                            if (response.errors[10001])
                                message = 'Número do cartão inválido'
                            else if (response.errors[30400])
                                message = 'Dados do cartão de crédito inválidos';
                            else
                                message = 'Verifique os dados informados';


                            swal('Erro ao criar o pedido', message, 'error');

                            $('#btn_place-order').button('reset');
                            this.stateProcessCheckout = false;
                        }
                    });
                }, err => {
                    // swal('Erro ao criar a sessão no Pagseguro', 'Falha ao criar a sessão no pagseguro', 'error');
                    // console.log(err);
                    $('#btn_place-order').button('reset');
                    this.stateProcessCheckout = false;
                });
        }
    }

    private PagseguroCreditCard(hash, creditCard): Promise<string> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise(resolve => {
                this.paymentManager.PagseguroCreditCard(hash, creditCard)
                    .subscribe(str => resolve(str))
            });
        }
    }

    /**
     * Pagamento com Boleto Mundipagg
     * 
     * @private
     * @param {string} cartId 
     * @memberof CheckoutComponent
     */
    private payWithMundipaggBankslip() {
        if (isPlatformBrowser(this.platformId)) {
            toastr['info']('Aguarde, validando seu pedido...');
            this.validateOrder()
                .then(cart => {
                    toastr['success']('Pedido validado. Processando informações de pagamento..');
                    return this.bankSlipTransaction();
                })
                .then(response => {
                    toastr['success']('Pagamento confirmado. Realizando pedido...');
                    return this.placeOrderApi();
                })
                .then(order => {
                    this.finish(order);
                })
                .catch(err => {
                    console.log(err);
                    swal('Erro ao criar o pedido', err.error, 'error');
                    $('#btn_place-order').button('reset');
                    this.stateProcessCheckout = false;
                });
        }
    }

    private bankSlipTransaction(): Promise<string> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise(resolve => {
                this.paymentManager.bankSlipTransaction()
                    .subscribe(str => {
                        resolve(str);
                    });
            });
        }
    }

    /**
     * Pagamento com Cartão de Crédito Mundipagg
     * 
     * @private
     * @param {string} cartId 
     * @memberof CheckoutComponent
     */
    private payWithMundipaggCreditCard() {
        if (isPlatformBrowser(this.platformId)) {
            toastr['info']('Aguarde, validando seu pedido...');
            this.validateOrder()
                .then(cart => {
                    toastr['success']('Pedido validado. Processando informações de pagamento..');
                    return this.creditCardTransaction(this.creditCard);
                })
                .then(response => {
                    toastr['success']('Pagamento confirmado. Realizando pedido...');
                    return this.placeOrderApi();
                })
                .then(order => {
                    this.finish(order);
                })
                .catch(err => {
                    console.log(err);
                    let message = err.error.replace(/"/g, '');
                    swal('Erro ao criar o pedido', (message.split('|')[1]) ? message.split('|')[1] : message, 'error')
                        .then(() => {
                            if (err.status == (402) && message.split('|')[0] == "C003" || message.split('|')[0] == '"C003') {
                                this.parentRouter.navigateByUrl(`/carrinho`);
                                location.reload();
                            }
                            else if (err.status == (402) && message.split('|')[0] == "C05"
                                || message.split('|')[0] == '"C05'
                                || message.split('|')[0] == '"C01'
                                || message.split('|')[0] == 'C01') {
                                this.parentRouter.navigateByUrl(`/`);
                                location.reload();
                            }
                        });
                    $('#btn_place-order').button('reset');
                    this.stateProcessCheckout = false;
                });
        }
    }

    creditCardTransaction(creditCard: CreditCard): Promise<string> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise(resolve => {
                this.paymentManager.creditCardTransaction(creditCard)
                    .subscribe(str => {
                        resolve(str);
                    }, err => {
                        console.log(err);
                        swal('Erro ao criar o pedido', err.error, 'error');
                        $('#btn_place-order').button('reset');
                        this.stateProcessCheckout = false;
                    });
            })
        }
    }

    /**
     * Pagamento com Boleto MercadoPago
     * 
     * @private
     * @param {string} cartId 
     * @memberof CheckoutComponent
     */
    private payWithMercadoPagoBankSlip() {
        if (isPlatformBrowser(this.platformId)) {
            toastr['info']('Aguarde, validando seu pedido...');
            this.validateOrder()
                .then(() => {
                    debugger
                    toastr['success']('Pedido validado. Processando informações de pagamento..');
                    return this.MercadoPagoBankSlip();
                })
                .then(() => {
                    debugger
                    toastr['success']('Pagamento confirmado. Realizando pedido...');
                    return this.placeOrderApi();
                })
                .then(order => {
                    debugger
                    this.finish(order);
                })
                .catch(error => {
                    debugger
                    Mercadopago.clearSession();
                    console.log(error);
                    swal('Erro ao criar o pedido', error.text(), 'error');
                    $('#btn_place-order').button('reset');
                    this.stateProcessCheckout = false;
                });
        }
    }


    MercadoPagoBankSlip(): Promise<string> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise(resolve => {
                this.paymentManager.MercadoPagoBankSlip()
                    .subscribe(
                        str => {
                            resolve(str)
                        },
                        err => {
                            console.log(err);
                        })
            });
        }
    }

    /**
     * Pagamento com Cartão de Crédito MercadoPago
     * 
     * @private
     * @param {string} cartId
     * @memberof CheckoutComponent
     */
    private payWithMercadoPagoCreditCard() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.paymentManager.isCardOK(this.creditCard)) {
                $('#btn_place-order').button('reset');
                this.stateProcessCheckout = false;
                swal('Erro ao criar o pedido', 'Verifique os dados do cartão', 'error');
                return;
            }

            toastr['info']('Aguarde, validando seu pedido...');
            this.validateOrder()
                .then(cart => {
                    toastr['success']('Pedido validado. Processando informações de pagamento..');
                    return this.GetMercadoPagoPublicKey();
                })
                .then(public_key => {
                    Mercadopago.setPublishableKey(public_key);
                    const form = document.querySelector('#mercadoPagoForm');
                    return new Promise(resolve =>
                        Mercadopago.createToken(form, (status, response) =>
                            resolve(response.id)));
                })
                .then(cardToken => {
                    toastr['success']('Processando pagamento com cartão de crédito..');
                    let card: MercadoPagoCreditCard = new MercadoPagoCreditCard();
                    card.cartToken = cardToken ? cardToken.toString() : undefined;
                    card.installmentQuantity = this.creditCard.installmentCount;
                    card.paymentMethodId = this.paymentSelected.mercadopago.id;
                    card.cpf = this.creditCard.taxId.replace(/\D/g, '');
                    return this.MercadoPagoCreditCard(card);
                })
                .then(response => {
                    toastr['success'](`${response}. Gerando o pedido...`);
                    return this.placeOrderApi();
                })
                .then(order => {
                    this.finish(order);
                })
                .catch(err => {
                    Mercadopago.clearSession();
                    $('#btn_place-order').button('reset');
                    this.stateProcessCheckout = false;
                    console.log(err);
                    let message: string = '';
                    if (!err)
                        message = 'Erro no gateway de pagamentos';
                    else if (err['_body'])
                        message = err.error;
                    else if (err['message'])
                        message = err.error;
                    else if (err['code'])
                        message = `${err.code} - ${err.error}`

                    swal('Erro ao criar o pedido', message, 'error');
                });
        }
    }

    MercadoPagoCreditCard(creditCard: MercadoPagoCreditCard): Promise<string> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise((resolve, reject) => {
                this.paymentManager.MercadoPagoCreditCard(creditCard)
                    .subscribe(str => resolve(str), err => reject(err));
            });
        }
    }

    GetMercadoPagoPublicKey(): Promise<string> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise(resolve => {
                this.paymentManager.getMercadoPagoPublicKey()
                    .subscribe(str => resolve(str))
            });
        }
    }


    /* Order Methods */
    private validateOrder(): Promise<Cart> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise((resolve, reject) => {
                this.orderManager.validateOrder()
                    .subscribe(cart => {
                        resolve(new Cart(cart));
                    }, error => reject(error));

            });
        }
    }

    private placeOrderApi(): Promise<Order> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise((resolve, reject) => {
                this.orderManager.placeOrder()
                    .subscribe(order => {
                        resolve(order);
                    }, error => reject(error));
            });
        }
    }

    isPackage(item: CartItem) {
        if (isPlatformBrowser(this.platformId)) {
            return item.isPackageProduct ? 'Sim' : 'Não';
        }
    }

    isStorePackageActive(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return this.store.settings.find(s => s.type == 8).status;
        }
    }

    /**
     * Verifica se a loja possui pagseguro
     * @returns {boolean} 
     * @memberof AppComponent
     */
    hasProcessCheckout(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return this.stateProcessCheckout;
        }
    }
}
