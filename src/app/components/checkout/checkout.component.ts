import { Component, OnInit } from '@angular/core';
import { Cart } from 'app/models/cart/cart';
import { Customer } from 'app/models/customer/customer';
import { CustomerAddress } from 'app/models/customer/customer-address';
import { Intelipost } from 'app/models/intelipost/intelipost';
import { Shipping } from 'app/models/shipping/shipping';
import { Payment } from 'app/models/payment/payment';
import { AppTexts } from 'app/app.texts';
import { CreditCard } from 'app/models/payment/credit-card';
import { PaymentMethod } from 'app/models/payment/payment-method';
import { PagseguroOption } from 'app/models/pagseguro/pagseguro-option';
import { MercadoPagoPaymentMethod } from 'app/models/mercadopago/mercadopago-paymentmethod';
import { Branch } from 'app/models/branch/branch';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CartManager } from 'app/managers/cart.manager';
import { CustomerService } from 'app/services/customer.service';
import { BranchService } from 'app/services/branch.service';
import { IntelipostService } from 'app/services/intelipost.service';
import { PaymentService } from 'app/services/payment.service';
import { PaymentManager } from 'app/managers/payment.manager';
import { OrderService } from 'app/services/order.service';
import { StoreService } from 'app/services/store.service';
import { Globals } from 'app/models/globals';
import { Store } from 'app/models/store/store';
import { AppSettings } from 'app/app.settings';
import { EnumStoreModality } from 'app/enums/store-modality.enum';
import { PaymentSelected } from 'app/models/payment/checkout-payment';
import { Order } from 'app/models/order/order';
import { PagseguroCreditCard } from 'app/models/pagseguro/pagseguro-card';
import { MercadoPagoCreditCard } from 'app/models/mercadopago/mercadopago-creditcard';

declare var swal: any;
declare var toastr: any;
declare var PagSeguroDirectPayment: any;
declare var Mercadopago: any;
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'checkout',
    templateUrl: '../../views/checkout.component.html',
})
export class CheckoutComponent implements OnInit {
    logged: boolean = false;
    private customer: Customer;
    private customer_ip = {};
    private intelipost: Intelipost = new Intelipost();
    private shippingSelected: Shipping = new Shipping();
    private payment: Payment = new Payment();
    private payments: Payment[] = [];
    private methodType: number;
    private token: string;
    
    mediaPath: string;
    mediaPathPayments: string;
    mediaPathPaint: string;
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

    constructor(
        private route: ActivatedRoute,
        private parentRouter: Router,
        private titleService: Title,
        private manager: CartManager,
        private customerService: CustomerService,
        private branchService: BranchService,
        private shippingService: IntelipostService,
        private paymentService: PaymentService,
        private paymentManager: PaymentManager,
        private orderService: OrderService,
        private storeService: StoreService,
        private globals: Globals
    ) {
        window.scrollTo(0, 0); // por causa das hash urls
     }

    /*
    ** Lifecycle
    */
    ngOnInit() {
        AppSettings.setTitle('Finalização da Compra', this.titleService);
        this.loadCart();
        this.getPayments();
     }

    ngAfterContentInit() {
        let store: Store = this.globals.store;
        this.mediaPath = `${store.link}/static/products/`;
        this.mediaPathPayments = `${store.link}/static/payments/`;
        this.mediaPathPaint = `${store.link}/static/custompaint/`;

        if (store.modality == EnumStoreModality.Budget) {
            this.parentRouter.navigateByUrl('/orcamento');
        }

        this.getCustomer()
        .then(customer => {
            return this.manager.setCustomerToCart();
        })
        .then(cart => {
            this.globals.cart = cart;
        });
    }
    
    /*
    ** Setting up 
    */
    private loadCart(): any{
        this.manager.getCart()
        .then(response => {
            AppSettings.setTitle('Finalização da Compra', this.titleService);
            this.globals.cart = response;
            this.shippingAddress = response.deliveryAddress;
            this.billingAddress = response.billingAddress;

            if (this.getNumItemsInCart() == 0) {
                this.parentRouter.navigateByUrl('/');
            }
        })
        .catch(error => {
            console.log(error);
            this.parentRouter.navigateByUrl('/');
        });
    }

    /**
     * Obtem o cliente autenticado
     * 
     * @private
     * @returns {Promise<Customer>} 
     * @memberof CheckoutComponent
     */
    private getCustomer(): Promise<Customer> {
        return new Promise((resolve, reject) => {
            if (this.logged) {
                resolve(this.customer);
            }
            else {
                this.customerService.getUser()
                .then(customer => {
                    this.customer = customer;
                    this.logged = true;
                    resolve(customer);
                })
                .catch((error) => {
                    this.logged = false;
                    reject(error);
                });
            }
        });
    }

    /**
     * Obtem da API todas as formas de pagamento disponíveis na loja
     * 
     * @memberof CheckoutComponent
     */
    getPayments(): Promise<Payment[]>{
        return new Promise((resolve, reject) => {
            this.paymentManager.getAll()
            .then(payments => {
                this.payments = payments;
                resolve(payments);
            })
            .catch(error => {
                console.log(error);
                swal('Erro ao obter as formas de pagamento', 'Não foi possível obter as formas de pagamento no momento', 'error');
                reject(error);
            });
        })
    }

    /*
    ** Getters
    */

    /**
     * 
     * Obtem o carrinho do Globals
     * @returns {Cart} 
     * @memberof CheckoutComponent
     */
    getCart(): Cart{
        return this.globals.cart;
    }


    /**
     * 
     * Obtem o valor de desconto total do carrinho
     * @returns {number} 
     * @memberof CheckoutComponent
     */
    getDiscount(): number {
        return this.globals.cart.totalDiscountPrice;
    }

    /**
     * Obtem o valor de frete do carrinho
     * 
     * @returns {number} 
     * @memberof CheckoutComponent
     */
    getShipping(): number {
        return this.globals.cart.totalFreightPrice;
    }

    /**
     * Obtem o subtotal da compra do carrinho
     * 
     * @returns 
     * @memberof CheckoutComponent
     */
    getSubTotal() {
        return this.globals.cart.totalProductsPrice + this.globals.cart.totalServicesPrice + this.globals.cart.totalCustomPaintPrice;
    }

    /**
     * Obtem o valor total da compra do carrinho
     * 
     * @returns {number} 
     * @memberof CheckoutComponent
     */
    getTotal(): number {
        return this.globals.cart.totalPurchasePrice;
    }

    /**
     * Obtem o valor total parcelado
     * 
     * @returns {number} 
     * @memberof CheckoutComponent
     */
    getTotalCreditCard(): number{
        if(!this.creditCard.totalPurchasePrice)
            return 0;
        else if(this.creditCard.totalPurchasePrice != this.globals.cart.totalPurchasePrice)
            return this.creditCard.totalPurchasePrice;
        else return 0;
    }

    /**
     * Obtem o valor total de serviços do carrinho
     * 
     * @returns {number} 
     * @memberof CheckoutComponent
     */
    getTotalServices(): number {
        return this.globals.cart.totalServicesPrice;
    }

    /**
     * Obtem o método de pagamento selecionado
     * 
     * @returns {PaymentMethod} 
     * @memberof CheckoutComponent
     */
    getPaymentTypeSelected(): PaymentMethod {
        if (this.isPagSeguro()) {
            this.methodSelected = new PaymentMethod();
            if(this.paymentSelected.pagseguro)
                this.methodSelected.name = (this.paymentSelected.pagseguro.name) ? this.paymentSelected.pagseguro.name : this.creditCard.creditCardBrand;
        }
        else if (this.isMercadoPago()) {
            this.methodSelected = new PaymentMethod();
            if(this.paymentSelected.mercadopago)
                this.methodSelected.name = (this.paymentSelected.mercadopago.payment_type_id == 'ticket') ? this.paymentSelected.mercadopago.name : this.creditCard.creditCardBrand;
        }
        else if(this.paymentSelected && this.isPickUpStorePayment(this.paymentSelected.payment)){
            this.methodSelected.name = 'Pagamento na Loja';
        }
        else if(this.isMundipaggBankslip()){
            this.methodSelected = this.paymentSelected.method;
        }
        else if(this.isMundipaggCreditCard()){
            this.methodSelected = this.paymentSelected.method;            
        }
        else this.methodSelected = new PaymentMethod();
        
        return this.methodSelected;
    }

    /**
     * Retorna o total de itens no carrinho
     * 
     * @returns {number} 
     * @memberof CheckoutComponent
     */
    getNumItemsInCart(): number {
        if(this.globals.cart){
            let numItems = 0;
            numItems += (this.globals.cart.products) ? this.globals.cart.products.length : 0;
            numItems += (this.globals.cart.services) ? this.globals.cart.services.length : 0;
            numItems += (this.globals.cart.paints) ? this.globals.cart.paints.length : 0;
            return  numItems;
        }
        else return 0;
    }

    /**
     * Retorna o endereço de entrega selecionado
     * 
     * @returns {CustomerAddress} 
     * @memberof CheckoutComponent
     */
    getDeliveryAddress(): CustomerAddress{
        return this.globals.cart.deliveryAddress;
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
    handlePaymentUpdated(paymentSelected: PaymentSelected){
        this.paymentSelected = paymentSelected;
    }

    /**
     * Obtem o frete selecionado
     * 
     * @param {Shipping} shipping 
     * @memberof CheckoutComponent
     */
    handleShippingUpdated(shipping: Shipping){
        this.shippingSelected = shipping;
    }

    handleCreditCardUpdated(event: CreditCard){
        this.creditCard = event;
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
    isMobile(): boolean{
        return AppSettings.isMobile();
    }

    /**
     * Verifica se o carrinho está vazio
     * 
     * @param {Cart} cart 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isCartEmpty(cart: Cart):boolean{
        let empty = false;

        if((cart.products == null || cart.products.length < 1) && (cart.paints == null || cart.paints.length < 1))
            empty = true;
    
        return empty;
    }

     /**
     * Verifica se o pagamento selecionado é Pagseguro
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isPagSeguro(payment: Payment = null): boolean{
        if(!payment)
            payment = this.paymentSelected.payment;
        return this.paymentManager.isPagSeguro(payment, this.payments);
    }

    /**
     * Verifica se o pagamento selecionado é MercadoPago
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isMercadoPago(paymentSelected: Payment = null): boolean{
        if(!paymentSelected)
            paymentSelected = this.paymentSelected.payment;
        return this.paymentManager.isMercadoPago(paymentSelected, this.payments);
    }

    /**
     * Verifica se o pagamento selecionado é pagamento na entrega
     * 
     * @param {Payment} payment 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isDeliveryPayment(payment: Payment): boolean{
        return this.paymentManager.isDeliveryPayment(payment, this.payments);
    }

    /**
     * Verifica se o pagamento selecionado é Boleto Mundipagg
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isMundipaggBankslip(paymentSelected: Payment = null): boolean{
        if(!paymentSelected)
            paymentSelected = this.paymentSelected.payment;
        return this.paymentManager.isMundipaggBankslip(paymentSelected, this.payments);
    }

    /**
     * Verifica se o pagamento selecionado é Mundipagg (Cartão de Crédito)
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isMundipaggCreditCard(paymentSelected: Payment = null): boolean{
        if(!paymentSelected)
            paymentSelected = this.paymentSelected.payment;
        return this.paymentManager.isMundipaggCreditCard(paymentSelected, this.payments);
    }

    /**
     * Verifica se o pagamento selecionado é Pagamento na Loja (Pickup Store)
     * 
     * @param {Payment} payment 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isPickUpStorePayment(payment: Payment): boolean{
        let pickUpStore: Payment = this.paymentManager.getPickUpStorePayment(this.payments);
        if(pickUpStore && payment && payment.id == pickUpStore.id)
            return true;
        else return false;
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
        if (this.shippingSelected.shippingType == 0)
            return false;
        else return true;
    }

    /**
     * Valida se o carrinho já possui meio de pagamento selecionado
     * 
     * @param {string} cartId 
     * @returns {boolean} 
     * 
     * @memberof CheckoutComponent
     */
    hasPaymentMethodSelected(cartId: string): boolean {
        if (this.methodSelected['id'] 
            || this.paymentSelected.pagseguro 
            || this.paymentSelected.mercadopago
            || this.isPickUpStorePayment(this.paymentSelected.payment)
        )
            return true;
        else return false;
    }

    /**
     * Informa se há endereço de entrega selecionado
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    hasDeliveryAddress(): boolean{
        let address = this.getDeliveryAddress();
        if(address && address.id)
            return true;
        else return false;
    }

    /**
     * Verifica se o troco selecionado (Delivery Payment) é válido
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    validChangeFor(): boolean {
        let isValid = true;
        if (this.methodSelected.type == 3) {
            if (this.changeFor && this.changeFor <= this.globals.cart.totalPurchasePrice) {
                isValid = false;
            }
        }

        return isValid;
    }

    /**
     * Valida se o checkout está OK para gerar o pedido
     * 
     * @returns {boolean} 
     * 
     * @memberof CheckoutComponent
     */
    checkoutIsValid(): boolean {
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
        else if (!this.hasPaymentMethodSelected(cartId)) {
            title = 'Forma de pagamento não selecionada';
            message = 'Selecione uma forma de pagamento';
            type = 'warning';
            valid = false;
        }

        if(!this.getPaymentTypeSelected().name){
            title = 'Nenhuma forma de pagamento selecionada';
            message =  'Não foi possível realizar o pedido';
            type = 'error';
            valid = false;
        }

        if (!valid) {
            swal(title, message, type);
        }

        return valid;
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
        event.preventDefault();
        $('#btn_place-order').button('loading');

        if (!this.checkoutIsValid()) {
            $('#btn_place-order').button('reset');
            return;
        }

        if (!this.validChangeFor()) {
            swal('Valor inválido','O valor para troco deve ser maior do que o valor total da compra','warning');
            $('#btn_place-order').button('reset');
            return;
        }

        let cartId = localStorage.getItem('cart_id');

        /* Pagamento Offline */
        if (this.paymentSelected.payment.type == 2) {
            this.payWithOfflineMethod(cartId);
        }
        /* Pagamento com cartão de crédito mundipagg */
        else if (this.isMundipaggCreditCard()) {
            this.payWithMundipaggCreditCard(cartId);
        }
        /* Pagamento com boleto mundipagg */
        else if (this.isMundipaggBankslip()) {
            this.payWithMundipaggBankslip(cartId);
        }
        /* Pagamento boleto pagseguro */
        else if (this.isPagSeguro() && this.paymentSelected.pagseguro.code == 202) {
            this.payWithPagseguroBankSlip(cartId);
        }
        /* Pagamento cartão de crédito pagseguro */
        else if (this.isPagSeguro() && this.paymentSelected.pagseguro.code >= 100 && this.paymentSelected.pagseguro.code <= 199) {
            this.payWithPagseguroCreditCard(cartId);
        }
        /* Pagamento boleto mercado pago */
        else if(this.isMercadoPago() && this.paymentSelected.mercadopago.payment_type_id == 'ticket') {
            this.payWithMercadoPagoBankSlip(cartId);
        }
        /* Pagamento cartão de crédito mercado pago */
        else if(this.isMercadoPago() && this.paymentSelected.mercadopago.payment_type_id == 'credit_card'){
            this.payWithMercadoPagoCreditCard(cartId);
        }
        else {
            swal('Não foi possível realizar o pedido', 'Nenhuma forma de pagamento selecionada', 'error');
            $('#btn_place-order').button('reset');
        }
    }

    /**
     * Finaliza a compra
     * 
     * @param {Order} order 
     * @memberof CheckoutComponent
     */
    completeOrder(order: Order){
        toastr['success']('Pedido realizado com sucesso!');
        this.globals.cart = null;
        localStorage.removeItem('cart_id');
        this.parentRouter.navigateByUrl(`/checkout/concluido/${order.id}`);       
    }

    /**
     * Pagamento com um método offline
     * 
     * @private
     * @param {string} cartId 
     * @memberof CheckoutComponent
     */
    private payWithOfflineMethod(cartId: string) {
        toastr['info']('Aguarde, validando seu pedido...');
        this.orderService.validateOrder(cartId)
        .then(cart => {
            toastr['success']('Pedido validado. Processando informações de pagamento..');
            let paymentRef = this.paymentSelected.payment.name.toLowerCase();
            if (paymentRef == 'pagamento na loja') {
                return this.paymentService.pickUpStoreTransaction(cartId);
            }
            else if (paymentRef = 'pagamento na entrega') {
                return this.paymentService.delivertPayment(cartId, this.changeFor);
            }
        })
        .then(response => {
            toastr['success']('Pagamento confirmado. Realizando pedido...');
            return this.orderService.placeOrder(cartId);
        })
        .then(order => {
            this.completeOrder(order);
        })
        .catch(error => {
            console.log(error);
            swal( 'Erro ao criar o pedido', error.text(), 'error');
            $('#btn_place-order').button('reset');
        });
    }

    /**
     * Pagamento com Boleto Pagseguro
     * 
     * @private
     * @param {string} cartId 
     * @memberof CheckoutComponent
     */
    private payWithPagseguroBankSlip(cartId: string) {
        toastr['info']('Aguarde, validando seu pedido...');
        let hash = PagSeguroDirectPayment.getSenderHash();
        this.orderService.validateOrder(cartId)
        .then(cart => {
            toastr['success']('Pedido validado. Processando informações de pagamento..');
            return this.paymentService.PagseguroBankSlip(cartId, hash)
        })
        .then(response => {
            toastr['success']('Pagamento confirmado. Realizando pedido...');
            return this.orderService.placeOrder(cartId);
        })
        .then(order => {
            this.completeOrder(order);
        })
        .catch(error => {
            console.log(error);
            swal('Erro ao criar o pedido', error.text(), 'error');
            $('#btn_place-order').button('reset');
        });
    }

    /**
     * Pagamento com Cartão de Crédito Pagseguro
     * 
     * @private
     * @param {string} cartId 
     * @memberof CheckoutComponent
     */
    private payWithPagseguroCreditCard(cartId: string) {
        if(!this.creditCard != null && !this.creditCard.isCardOK()){
            swal('Erro', 'Verifique os dados do cartão', 'error');
            $('#btn_place-order').button('reset');
            return;
        }
        toastr['info']('Criando a sessão no Pagseguro...');
        this.paymentManager.createPagSeguroSession()
        .then(session => {
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
                    this.orderService.validateOrder(cartId)
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
    
                        return this.paymentService.PagseguroCreditCard(cartId, hash, creditCard)
                    })
                    .then(response => {
                        toastr['success']('Pagamento confirmado. Realizando pedido...');
                        return this.orderService.placeOrder(cartId);
                    })
                    .then(order => {
                        this.completeOrder(order);
                    })
                    .catch(error => {
                        console.log(error);
                        let message = (error.status != 0) ? error.text().replace(/"/g, '') : 'Erro ao finalizar a compra com o Pagseguro';
                        swal('Erro ao criar o pedido', (message.split('|')[1]) ? message.split('|')[1] : message, 'error');
                        
                        $('#btn_place-order').button('reset');
                    });
                }, error: response => {
                    console.log(response);
                    let message: string;
                    if(response.errors[10001])
                        message = 'Número do cartão inválido'
                    else if(response.errors[30400])
                        message = 'Dados do cartão de crédito inválidos';
                    else
                        message = 'Verifique os dados informados';


                    swal('Erro ao criar o pedido', message, 'error');
    
                    $('#btn_place-order').button('reset');
                }
            });
        })
        .catch(error => {
            swal('Erro ao criar a sessão no Pagseguro', 'Falha ao criar a sessão no pagseguro', 'error');
            console.log(error);
            $('#btn_place-order').button('reset');
        });
    }

    /**
     * Pagamento com Boleto Mundipagg
     * 
     * @private
     * @param {string} cartId 
     * @memberof CheckoutComponent
     */
    private payWithMundipaggBankslip(cartId: string) {
        toastr['info']('Aguarde, validando seu pedido...');
        this.orderService.validateOrder(cartId)
        .then(cart => {
            toastr['success']('Pedido validado. Processando informações de pagamento..');
            return this.paymentService.bankSlipTransaction(cartId);
        })
        .then(response => {
            toastr['success']('Pagamento confirmado. Realizando pedido...');
            return this.orderService.placeOrder(cartId);
        })
        .then(order => {
            this.completeOrder(order);
        })
        .catch(error => {
            console.log(error);
            swal('Erro ao criar o pedido', error.text(), 'error');
            $('#btn_place-order').button('reset');
        });
    }

    /**
     * Pagamento com Cartão de Crédito Mundipagg
     * 
     * @private
     * @param {string} cartId 
     * @memberof CheckoutComponent
     */
    private payWithMundipaggCreditCard(cartId: string) {
        toastr['info']('Aguarde, validando seu pedido...');
        this.orderService.validateOrder(cartId)
        .then(cart => {
            toastr['success']('Pedido validado. Processando informações de pagamento..');
            return this.paymentService.creditCardTransaction(cartId, this.creditCard);
        })
        .then(response => {
            toastr['success']('Pagamento confirmado. Realizando pedido...');
            return this.orderService.placeOrder(cartId);
        })
        .then(order => {
            this.completeOrder(order);
        })
        .catch(error => {
            console.log(error);
            let message = error.text().replace(/"/g, '');
            swal('Erro ao criar o pedido', (message.split('|')[1]) ? message.split('|')[1] : message, 'error')
            .then(() => {
                if (error.status == (402) && message.split('|')[0] == "C003" || message.split('|')[0] == '"C003') {
                    this.parentRouter.navigateByUrl(`/carrinho`);
                    location.reload();
                }
                else if (error.status == (402) && message.split('|')[0] == "C05"
                    || message.split('|')[0] == '"C05'
                    || message.split('|')[0] == '"C01'
                    || message.split('|')[0] == 'C01') {
                    this.parentRouter.navigateByUrl(`/`);
                    location.reload();
                }
            });
            $('#btn_place-order').button('reset');
        })
    }

    /**
     * Pagamento com Boleto MercadoPago
     * 
     * @private
     * @param {string} cartId 
     * @memberof CheckoutComponent
     */
    private payWithMercadoPagoBankSlip(cartId: string) {
        toastr['info']('Aguarde, validando seu pedido...');
        this.orderService.validateOrder(cartId)
        .then(cart => {
            toastr['success']('Pedido validado. Processando informações de pagamento..');
            return this.paymentService.MercadoPagoBankSlip(cartId)
        })
        .then(response => {
            toastr['success']('Pagamento confirmado. Realizando pedido...');
            return this.orderService.placeOrder(cartId);
        })
        .then(order => {
            this.completeOrder(order);
        })
        .catch(error => {
            console.log(error);
            swal('Erro ao criar o pedido', error.text(), 'error');
            $('#btn_place-order').button('reset');
        });
    }

    /**
     * Pagamento com Cartão de Crédito MercadoPago
     * 
     * @private
     * @param {string} cartId 
     * @memberof CheckoutComponent
     */
    private payWithMercadoPagoCreditCard(cartId: string){

        if(!this.creditCard.isCardOK()){
            $('#btn_place-order').button('reset');
            swal('Erro ao criar o pedido', 'Verifique os dados do cartão', 'error');
            return;
        }

        toastr['info']('Aguarde, validando seu pedido...');
        this.orderService.validateOrder(cartId)
        .then(cart => {
            toastr['success']('Pedido validado. Processando informações de pagamento..');
            return this.paymentService.GetMercadoPagoPublicKey();
        })
        .then(public_key => {
            Mercadopago.setPublishableKey(public_key);
            let form = document.querySelector('#mercadoPagoForm');
            return new Promise((resolve, reject) => {
                Mercadopago.createToken(form, (status, response) => {
                    if(status == 200)
                        resolve(response.id);
                    else 
                        reject(this.paymentManager.getMercadoPagoError(response.cause[0].code))
                })
            });
        })
        .then(cardToken => {
            toastr['success']('Processando pagamento com cartão de crédito..');
            let card: MercadoPagoCreditCard = new MercadoPagoCreditCard();
            card.cartToken = cardToken.toString();
            card.installmentQuantity = this.creditCard.installmentCount;
            card.paymentMethodId = this.paymentSelected.mercadopago.id;
            card.cpf = this.creditCard.taxId.replace(/\D/g, '');
            return this.paymentService.MercadoPagoCreditCard(cartId, card)
        })
        .then(response => {
            toastr['success'](`${response}. Gerando o pedido...`);
            return this.orderService.placeOrder(cartId);
        })
        .then(order => {
            this.completeOrder(order);
        })
        .catch(error => {
            $('#btn_place-order').button('reset');
            console.log(error);
            let message: string = '';
            if(!error)
                message = 'Erro no gateway de pagamentos';
            else if(error['_body']) 
                message = error.text();
            else if(error['message'])
                message = error.message;
            else if(error['code'])
                message = `${error.code} - ${error.message}`

            swal('Erro ao criar o pedido', message, 'error');
        });
        
    }
}