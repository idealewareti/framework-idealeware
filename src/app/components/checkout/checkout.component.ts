import { Component, OnInit } from '@angular/core';
import { Cart } from "app/models/cart/cart";
import { Customer } from "app/models/customer/customer";
import { CustomerAddress } from "app/models/customer/customer-address";
import { Intelipost } from "app/models/intelipost/intelipost";
import { Shipping } from "app/models/shipping/shipping";
import { Payment } from "app/models/payment/payment";
import { AppSettings } from "app/app.settings";
import { AppTexts } from "app/app.texts";
import { CreditCard } from "app/models/payment/credit-card";
import { PaymentMethod } from "app/models/payment/payment-method";
import { PagseguroOption } from "app/models/pagseguro/pagseguro-option";
import { MercadoPagoPaymentMethod } from "app/models/mercadopago/mercadopago-paymentmethod";
import { Branch } from "app/models/branch/branch";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser/";
import { CartManager } from "app/managers/cart.manager";
import { CustomerService } from "app/services/customer.service";
import { CartService } from "app/services/cart.service";
import { BranchService } from "app/services/branch.service";
import { IntelipostService } from "app/services/intelipost.service";
import { OrderService } from "app/services/order.service";
import { PaymentService } from "app/services/payment.service";
import { StoreService } from "app/services/store.service";
import { IntelipostRequest } from "app/models/intelipost/intelipost-request";
import { PagseguroCreditCard } from "app/models/pagseguro/pagseguro-card";
import { MercadoPagoCreditCard } from "app/models/mercadopago/mercadopago-creditcard";
import { EnumShippingType } from "app/enums/shipping-type.enum";
import { DeliveryInformation } from "app/models/shipping/delivery-information";
import { IntelipostDeliveryOption } from "app/models/intelipost/intelipost-delivery-option";
import { PaymentSelected } from "app/models/payment/checkout-payment";
import { PaymentMethodTypeEnum } from "app/enums/payment-method-type.enum";
import { PaymentManager } from "app/managers/payment.manager";
import { Globals } from "app/models/globals";
import { Order } from "app/models/order/order";

declare var $: any;
declare var S: any;
declare var swal: any;
declare var PagSeguroDirectPayment: any;
declare var Mercadopago: any;
declare var toastr: any;

@Component({
    moduleId: module.id,
    selector: 'checkout',
    templateUrl: '../../views/checkout.component.html',
})
export class CheckoutComponent implements OnInit {
    private cart: Cart;
    logged: boolean = false;
    private customer: Customer;
    private selectedAddress: CustomerAddress;
    private selectedBillingAddress: CustomerAddress;
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
    public readonly paymentMethodTypes = AppTexts.PAYMENT_METHOD_TYPES;

    showAddresses: boolean = false;
    showBillingAddresses: boolean = false;
    availableMethodTypes = [];
    creditCard: CreditCard = new CreditCard();
    paymentSelected: Payment = null;
    methodSelected: PaymentMethod = new PaymentMethod();
    optionSelected: PagseguroOption = new PagseguroOption();
    mercadoPagoPaymentMethods: MercadoPagoPaymentMethod = new MercadoPagoPaymentMethod();
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

    ngOnInit() { 
        this.storeService.getInfo()
        .then(store => {
            this.mediaPath = `${store.link}/static/products/`;
            this.mediaPathPayments = `${store.link}/static/payments/`;
            this.mediaPathPaint = `${store.link}/static/custompaint/`;

            if (store.modality == 0) {
                this.parentRouter.navigateByUrl('/orcamento');
            }
            else
                return this.getCustomer();
        })
        .then(customer => {
            return this.manager.setCustomerToCart();
        })
        .catch(error => {
            console.log(error);
            this.parentRouter.navigateByUrl('/');
        })
        .then(customer => {
            this.customer_ip = JSON.parse(localStorage.getItem('customer_ip'));
        });

        this.manager.getCart()
        .then(response => {
            AppSettings.setTitle('Finalização da Compra', this.titleService);
            this.cart = response;
            if (this.cart.products.length == 0) {
                this.parentRouter.navigateByUrl('/');
            }
        })
        .catch(error => {
            console.log(error);
            this.parentRouter.navigateByUrl('/');
        });

        this.paymentService.getAll()
        .then(payments => {
            this.payments = payments;
            return this.paymentManager.getDefault();
        })
        .then(defaultPayment => {
            this.defaultPayment = defaultPayment;
        })
        .catch(error => {
            console.log(error);
        });
        
    }

    /* Values */
    getDiscount(): number {
        return this.cart.totalDiscountPrice;
    }

    getShipping(): number {
        return this.cart.totalFreightPrice;
    }

    getSubTotal() {
        return this.cart.totalProductsPrice + this.cart.totalServicesPrice + this.cart.totalCustomPaintPrice;
    }

    getTotal(): number {
        return this.cart.totalPurchasePrice;
    }

    getTotalServices(): number {
        return this.cart.totalServicesPrice;
    }

    getNumItemsInCart() {
        if(this.cart){
            let numItems = 0;
            numItems += (this.cart.products) ? this.cart.products.length : 0;
            numItems += (this.cart.services) ? this.cart.services.length : 0;
            numItems += (this.cart.paints) ? this.cart.paints.length : 0;
            
            return  numItems;
        }
        else return 0;
    }

    selectedAddressOrDefault(): CustomerAddress {
        if (!this.selectedAddress)
            this.selectThisAddress(this.customer.addresses.filter(a => a.mainAddress == true)[0], null);
        
        return this.selectedAddress;
    }

    selectedBillingAddressOrDefault(): CustomerAddress{
        if(!this.selectedBillingAddress)
            this.selectThisBillingAddress(this.customer.addresses.filter(a => a.mainAddress == true)[0], null);
        
        return this.selectedBillingAddress;
    }

    selectThisBillingAddress(address: CustomerAddress, event = null){
        if(event)
            event.preventDefault();
        this.selectedBillingAddress = address;
        this.showBillingAddresses = false;
        let cartId = localStorage.getItem('cart_id');
        this.manager.addBillingAddress(cartId, address.id)
        .catch(error => {
            console.log(error);
        });
    }

    selectThisAddress(address: CustomerAddress, event) {
        if (event) event.preventDefault();
        this.selectedAddress = address;
        this.showAddresses = false;
        let cartId = localStorage.getItem('cart_id');

        let request = new IntelipostRequest(null, null, null, address.zipCode);
        this.shippingService.getShipping(request)
        .then(response => {
            this.intelipost = response;
            return this.manager.addDeliveryAddress(cartId, address.id);
        })
        .then(cart => {
            this.getBranches(address.zipCode);
            this.addShippingToCart(null, this.intelipost.content.delivery_options[0]);
        })
        .catch(error => {
            console.log(error);
            let message = error.text().replace(/"/g, '');

            if(message.split('|').length > 1)
                message = message.split('|')[1];

            swal({
                title: 'Erro',
                text: message,
                type: 'warning',
                confirmButtonText: 'OK'
            });

        });
    }

    getCustomer(): Promise<Customer> {
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

    paymentAvailable(type: number): boolean {
        let available = false
        if (this.payment.paymentMethods.filter(m => m.type == type).length > 0)
            available = true;
        return available;;
    }

    getPaymentLabel(type): any {
        return this.paymentMethodTypes.filter(m => m.value == type)[0].label;
    }

    isCreditCard(): boolean {
        if (this.methodType && this.methodType == 1) return true;
        else return false;
    }

    isBankSlip(): boolean {
        if (this.methodType && this.methodType == 2) return true;
        else return false;
    }

    isDeliveryPayment(): boolean{
        if(this.methodSelected && this.methodSelected.type == 3) return true;
        else return false;
    }

    isOtherMethods(): boolean {
        if (this.methodType && this.methodType == 99) return true;
        else return false;
    }

    isReadyToCheckout(): boolean {
        if (!this.methodSelected.id && (!this.optionSelected || !this.optionSelected.code))
            return false;
        else if (!this.selectedAddress.id)
            return false;
        else return true;
    }

    placeOrder(event) {
        event.preventDefault();
        $('#btn_place-order').button('loading');

        if (!this.checkoutIsValid()) {
            $('#btn_place-order').button('reset');
            return false;
        }

        if (!this.validChangeFor()) {
            swal('Valor inválido','O valor para troco deve ser maior do que o valor total da compra','warning');
            $('#btn_place-order').button('reset');
            return;
        }

        if(!this.getPaymentTypeSelected().name){
            swal('Nenhuma forma de pagamento selecionada', 'Não foi possível realizar o pedido', 'error');
            $('#btn_place-order').button('reset');
            return;
        }

        let cartId = localStorage.getItem('cart_id');

        /* Pagamento Offline */
        if (this.paymentSelected.type == 2) {
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
        else if (this.isPagSeguro() && this.optionSelected.code == 202) {
            this.payWithPagseguroBankSlip(cartId);
        }
        /* Pagamento cartão de crédito pagseguro */
        else if (this.isPagSeguro() && this.optionSelected.code >= 100 && this.optionSelected.code <= 199) {
            this.payWithPagseguroCreditCard(cartId);
        }
        /* Pagamento boleto mercado pago */
        else if(this.isMercadoPago() && this.mercadoPagoPaymentMethods.payment_type_id == 'ticket') {
            this.payWithMercadoPagoBankSlip(cartId);
        }
        /* Pagamento cartão de crédito mercado pago */
        else if(this.isMercadoPago() && this.mercadoPagoPaymentMethods.payment_type_id == 'credit_card'){
            this.payWithMercadoPagoCreditCard(cartId);
        }
        else {
            swal('Não foi possível realizar o pedido', 'Nenhuma forma de pagamento selecionada', 'error');
            $('#btn_place-order').button('reset');
        }
    }

    /* PAYMENTS - BEGIN */
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
            let paymentRef = this.paymentSelected.name.toLowerCase();
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
            this.finishOrder(order);
        })
        .catch(error => {
            console.log(error);
            swal({
                title: 'Erro ao criar o pedido',
                text: error.text(),
                type: 'error',
                confirmButtonText: 'OK'
            });
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
            this.finishOrder(order);
        })
        .catch(error => {
            console.log(error);
            swal({
                title: 'Erro ao criar o pedido',
                text: error.text(),
                type: 'error',
                confirmButtonText: 'OK'
            });
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
                    creditCard.cpf = this.creditCard.taxId;
                    creditCard.birthDate = this.creditCard.birthDate;
                    creditCard.phone = this.creditCard.phone;
                    creditCard.installmentQuantity = this.creditCard.installmentCount;
                    creditCard.installmentValue = this.creditCard.installmentValue;
                    creditCard.noInterestInstallmentQuantity = Number.parseInt(this.paymentSelected.settings.find(s => s.name == ("NoInterestInstallmentQuantity")).value);

                    return this.paymentService.PagseguroCreditCard(cartId, hash, creditCard)
                })
                .then(response => {
                    toastr['success']('Pagamento confirmado. Realizando pedido...');
                    return this.orderService.placeOrder(cartId);
                })
                .then(order => {
                    this.finishOrder(order);
                })
                .catch(error => {
                    console.log(error);
                    let message = error.text().replace(/"/g, '');
                    swal({
                        title: 'Erro ao criar o pedido',
                        text: (message.split('|')[1]) ? message.split('|')[1] : message,
                        type: 'error',
                        confirmButtonText: 'OK'
                    })
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


                    });
            }, error: response => {
                console.log(response);
                swal({
                    title: 'Erro ao criar o pedido',
                    text: 'Verifique os dados informados',
                    type: 'error',
                    confirmButtonText: 'OK'
                })
                .then(() => {
                    if (response.error && response.errors[30400]) {
                        location.reload();
                    }
                });

                $('#btn_place-order').button('reset');

            }
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
            this.finishOrder(order);
        })
        .catch(error => {
            swal({
                title: 'Erro ao criar o pedido',
                text: error.text(),
                type: 'error',
                confirmButtonText: 'OK'
            });
            console.log(error);
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
            this.finishOrder(order);
        })
        .catch(error => {
            console.log(error);
            let message = error.text().replace(/"/g, '');
            swal({
                title: 'Erro ao criar o pedido',
                text: (message.split('|')[1]) ? message.split('|')[1] : message,
                type: 'error',
                confirmButtonText: 'OK'
            })
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
            this.finishOrder(order);
        })
        .catch(error => {
            console.log(error);
            swal({
                title: 'Erro ao criar o pedido',
                text: error.text(),
                type: 'error',
                confirmButtonText: 'OK'
            });
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
            card.paymentMethodId = this.mercadoPagoPaymentMethods.id;
            return this.paymentService.MercadoPagoCreditCard(cartId, card)
        })
        .then(response => {
            toastr['success'](`${response}. Gerando o pedido...`);
            return this.orderService.placeOrder(cartId);
        })
        .then(order => {
            this.finishOrder(order);
        })
        .catch(error => {
            console.log(error);
            let message: string = '';
            
            if(error['_body']) 
                message = error.text();
            else if(error['message'])
                message = error.message;
            else if(error['code'])
                message = `${error.code} - ${error.message}`

            swal({
                title: 'Erro ao criar o pedido',
                text: message,
                type: 'error',
                confirmButtonText: 'OK'
            });
            $('#btn_place-order').button('reset');
        });
        
    }
    /* PAYMENTS - END */

    showMyAddresses(event, isBillingAddress: boolean = false) {
        event.preventDefault();
        if(isBillingAddress)
            this.showBillingAddresses = !this.showBillingAddresses;
        else
            this.showAddresses = !this.showAddresses;
    }

    checkOption(methodName: string, branch: Branch = null): boolean {
        if (methodName) {
            if (!this.shippingSelected.deliveryInformation)
                return false
            else if (this.shippingSelected.deliveryInformation.deliveryMethodName == methodName)
                return true;
            else return false;
        }
        else {
            if (!this.shippingSelected.branch)
                return false;
            else if (this.shippingSelected.branch.id == branch.id)
                return true;
            else return false;
        }
    }

    addShippingToCart(event, intelipostOption: IntelipostDeliveryOption = null, branch: Branch = null) {
        if (event)
            event.preventDefault();
        let shipping = new Shipping();
        let delivery = new DeliveryInformation();

        if (intelipostOption) {
            shipping.shippingType = EnumShippingType.Delivery;
            delivery.quotId = this.intelipost.content.id.toString();
            delivery.deliveryMethodId = intelipostOption.delivery_method_id.toString();
            delivery.shippingCost = intelipostOption.final_shipping_cost;
            delivery.deliveryMethodName = intelipostOption.delivery_method_name;
            delivery.deliveryProviderName = intelipostOption.logistic_provider_name;
            delivery.deliveryEstimateBusinessDays = intelipostOption.delivery_estimate_business_days;
            delivery.deliveryEstimatedDate = this.addToDate(new Date(), 'day', delivery.deliveryEstimateBusinessDays);
            delivery.deliveryEstimatedDateMax = this.addToDate(new Date(), 'day', delivery.deliveryEstimateBusinessDays);
            shipping.deliveryInformation = delivery;
        }
        else if (branch) {
            shipping.shippingType = EnumShippingType.PickuUpStore;
            shipping.branch = branch;
            delivery.quotId = branch.id;
            delivery.deliveryMethodId = branch.id;
            delivery.deliveryMethodName = 'Retirar na Loja';
            delivery.shippingCost = 0.0;
            delivery.deliveryProviderName = branch.name;
            delivery.deliveryEstimateBusinessDays = branch.replenishmentTime;
            delivery.deliveryEstimatedDate = this.addToDate(new Date(), 'day', branch.replenishmentTime);
            delivery.deliveryEstimatedDateMax = this.addToDate(new Date(), 'day', branch.replenishmentTime);
            shipping.deliveryInformation = delivery;
        }

        this.manager.setShipping(shipping)
        .then(cart => {
            this.cart = cart;
            this.shippingSelected = shipping;
            this.methodSelected = new PaymentMethod();
        })
        .catch(error => {
            swal({ title: 'Erro!', text: 'Não foi possível atualizar o frete', type: 'error', confirmButtonText: 'OK' });
            console.log(error);
        });
    }

    private addToDate(currentDate, unit, howMuch) {
        let config = {
            second: 1000, // 1000 miliseconds
            minute: 60000,
            hour: 3600000,
            day: 86400000,
            week: 604800000,
            month: 2592000000, // Assuming 30 days in a month
            year: 31536000000 // Assuming 365 days in year
        };

        let now = new Date(currentDate).getTime();

        return new Date(now + config[unit] * howMuch);
    }

    getBranches(zipcode: string) {
        zipcode = zipcode.replace('-', '');
        this.branchService.getBranches(zipcode)
        .then(branches => {
            this.branches = branches;
        })
        .catch(error => console.log(error));
    }

    allowPickUpStore(): Branch[] {
        return this.branches.filter(b => b.allowPickupStore);
    }

    /* HANDLERS - BEGIN */
    // handlePaymentUpdated(event: PaymentSelected) {
    //     this.methodSelected = event.method;
    //     this.paymentSelected = event.payment;
    //     this.optionSelected = event.pagseguro;
    //     this.mercadoPagoPaymentMethods = event.mercadopago;
    // }

    handleMercadoPagoUpdated(event: PaymentSelected){
        if(this.isMercadoPago(event.payment)){
            this.methodSelected = event.method;
            this.paymentSelected = event.payment;
            this.mercadoPagoPaymentMethods = event.mercadopago;
            this.optionSelected = null;
            this.creditCard = event.creditCard;
        }
    }

    handleMundipaggBankslipUpdated(event: PaymentSelected){
        if(this.isMundipagg(event.payment) && event.method.type == PaymentMethodTypeEnum.BankSlip){
            this.methodSelected = event.method;
            this.creditCard = null;
            this.mercadoPagoPaymentMethods = null;
            this.optionSelected = null;
        }
    }

    handleMundipaggCreditCardUpdated(event: PaymentSelected){
        if(this.isMundipagg(event.payment) && event.method.type == PaymentMethodTypeEnum.CreditCard){
            this.methodSelected = event.method;
            this.paymentSelected = event.payment;
            this.creditCard = event.creditCard;
            
            this.mercadoPagoPaymentMethods = null;
            this.optionSelected = null;
        }
    }

    handlePagseguroUpdated(event: PaymentSelected) {
        if(this.isPagSeguro(event.payment)){
            this.optionSelected = event.pagseguro;
            this.paymentSelected = event.payment;
            this.creditCard = event.creditCard;
            
            this.methodSelected = null;
            this.mercadoPagoPaymentMethods = null;
        }
    }

    handlePickUpStorePayment(event: PaymentSelected){
        if(this.isPickUpStorePayment(event.payment)){
            this.optionSelected = null;
            this.paymentSelected = event.payment;
            this.creditCard = null;
            this.methodSelected = event.payment.paymentMethods[0];
            this.mercadoPagoPaymentMethods = null;
        }
    }
    /* HANDLERS - END */

    /* VALIDATIONS - BEGIN */
    validChangeFor(): boolean {
        let isValid = true;

        if (this.methodSelected.type == 3) {
            if (this.changeFor && this.changeFor <= this.cart.totalPurchasePrice) {
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

        if (!this.hasShippingSelected()) {
            title = 'Opção de entrega não selecionada';
            message = 'Selecione uma opção de entrega';
            valid = false;
        }
        else if (!this.hasPaymentMethodSelected(cartId)) {
            title = 'Forma de pagamento não selecionada';
            message = 'Selecione uma forma de pagamento';
            valid = false;
        }

        if (!valid) {
            swal({
                title: title,
                text: message,
                type: 'warning',
                confirmButtonText: 'OK'
            });
        }

        return valid;
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
        if (this.methodSelected['id'] || this.optionSelected || this.mercadoPagoPaymentMethods)
            return true;
        else return false;
    }

    /**
     * Verifica se existe pagamento com Mercado Pago Ativado
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    hasMercadoPago(): boolean{
        return this.paymentManager.hasMercadoPago(this.payments);
    }


    /**
     * Retorna o meio de pagamento do Mercado Pago
     * 
     * @returns {Payment} 
     * @memberof CheckoutComponent
     */
    getMercadoPago(): Payment{
        return this.paymentManager.getMercadoPago(this.payments);
    }

    /**
     * Verifica se o pagamento selecionado é MercadoPago
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isMercadoPago(paymentSelected: Payment = null): boolean{
        if(!paymentSelected)
            paymentSelected = this.paymentSelected;
        return this.paymentManager.isMercadoPago(paymentSelected, this.payments);
    }

    /**
     * Verifica se existe pagamento com Pagseguro Ativado
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    hasPagSeguro(): boolean{
        return this.paymentManager.hasPagSeguro(this.payments);
    }

    /**
     * Retorna o meio de pagamento do Pagseguro
     * 
     * @returns {Payment} 
     * @memberof CheckoutComponent
     */
    getPagSeguro(): Payment{
        return this.payments.find(p => p.name.toLowerCase() == 'pagseguro');
    }

    /**
     * Verifica se o pagamento selecionado é Pagseguro
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isPagSeguro(payment: Payment = null): boolean{
        if(!payment)
            payment = this.paymentSelected;
        return this.paymentManager.isPagSeguro(payment, this.payments);
    }

    /**
     * Verifica se existe pagamento com Boleto Mundipagg Pago Ativado
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    hasMundipaggBankslip(): boolean{
        return this.paymentManager.hasMundipaggBankslip(this.payments);
    }

    /**
     * Retorna o meio de pagamento do Mundipagg (Boleto)
     * 
     * @returns {Payment} 
     * @memberof CheckoutComponent
     */
    getMundipaggBankslip(): Payment{
        return this.paymentManager.getMundipaggBankslip(this.payments);
    }

    /**
     * Verifica se o pagamento selecionado é Boleto Mundipagg
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isMundipaggBankslip(paymentSelected: Payment = null): boolean{
        if(!paymentSelected)
            paymentSelected = this.paymentSelected;
        return this.paymentManager.isMundipaggBankslip(paymentSelected, this.payments);
    }

    /**
     * Verifica se existe pagamento com Cartão de Crédito Mundipagg Ativado
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    hasMundipaggCreditCard(): boolean{
        return this.paymentManager.hasMundipaggCreditCard(this.payments);
    }

    /**
     * Retorna o meio de pagamento do Mundipagg (Cartão de Crédito)
     * 
     * @returns {Payment} 
     * @memberof CheckoutComponent
     */
    getMundipaggCreditCard(): Payment{
        return this.paymentManager.getMundipaggCreditCard(this.payments);
    }
        
    /**
     * Verifica se o pagamento selecionado é Mundipagg (Cartão de Crédito)
     * 
     * @returns {boolean} 
     * @memberof CheckoutComponent
     */
    isMundipaggCreditCard(paymentSelected: Payment = null): boolean{
        if(!paymentSelected)
            paymentSelected = this.paymentSelected;
        return this.paymentManager.isMundipaggCreditCard(paymentSelected, this.payments);
    }

    isMundipagg(paymentSelected: Payment = null){
        if(!paymentSelected)
            paymentSelected = this.paymentSelected;
        if(paymentSelected.name.toLowerCase() == 'mundipagg')
            return true;
        else return false;
    }

    isPickUpStore(): boolean{
        if(this.hasShippingSelected() && this.cart.shipping.shippingType == EnumShippingType.PickuUpStore)
            return true;
        else
            return false;
    }

    isDefaultPayment(payment: Payment){        
        if(this.defaultPayment && this.defaultPayment.id == payment.id)
     return true;
        else return false;
    }

    getPickUpStorePayment(): Payment{
        return this.payments.find(p => p.name.toLowerCase() == 'pagamento na loja');
    }

    hasPickUpStorePayment(): boolean{
        let payment = this.getPickUpStorePayment();
        if(payment)
            return true;
        else return false;
    }

    isPickUpStorePayment(payment: Payment): boolean{
        let pickUpStore: Payment = this.getPickUpStorePayment();
        if(pickUpStore && payment.id == pickUpStore.id)
            return true;
        else return false;
    }
    /* VALIDATIONS - END */

    getPaymentTypeSelected(): PaymentMethod {
        if (this.isPagSeguro()) {
            this.methodSelected = new PaymentMethod();
            this.methodSelected.name = (this.optionSelected) ? this.optionSelected.name : '';
            return this.methodSelected;
        }
        else if (this.isMercadoPago()) {
            this.methodSelected = new PaymentMethod();
            this.methodSelected.name = this.mercadoPagoPaymentMethods.name;
            return this.methodSelected;
        }
        // else if(this.paymentSelected && this.isPickUpStorePayment(this.paymentSelected)){
        //     this.methodSelected.name == 'Pagamento na Loja';
        // }
        else {
            return this.methodSelected;
        }
    }

    isCartEmpty(cart: Cart):boolean{
        let empty = false;

        if((cart.products == null || cart.products.length < 1) && (cart.paints == null || cart.paints.length < 1))
            empty = true;
    
        return empty;
    }

    isMobile(){
        return AppSettings.isMobile();
    }

    selectThisPayment(payment: Payment, event = null){
        if(event)
            event.preventDefault();
        this.paymentSelected = payment;
        this.methodSelected = null;

        if(this.isPickUpStorePayment(payment)){
            let selected: PaymentSelected = new PaymentSelected(payment, payment.paymentMethods[0]);
            this.handlePickUpStorePayment(selected);
        }
    }

    finishOrder(order: Order){
        toastr['success']('Pedido realizado com sucesso!');
        this.globals.cart = null;
        localStorage.removeItem('cart_id');
        this.parentRouter.navigateByUrl(`/checkout/concluido/${order.id}`);       
    }
}