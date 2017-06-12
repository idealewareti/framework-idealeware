import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from 'app/helpers/httpclient'
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CartItem } from 'app/models/cart/cart-item';
import { Cart } from "app/models/cart/cart";
import { CustomerService } from "app/services/customer.service";
import { Customer } from "app/models/customer/customer";
import { CustomerAddress } from "app/models/customer/customer-address";
import { IntelipostService } from "app/services/intelipost.service";
import { IntelipostRequest } from "app/models/intelipost/intelipost-request";
import { Intelipost } from "app/models/intelipost/intelipost";
import { IntelipostDeliveryOption } from "app/models/intelipost/intelipost-delivery-option";
import { Shipping } from "app/models/shipping/shipping";
import { DeliveryInformation } from "app/models/shipping/delivery-information";
import { PaymentService } from "app/services/payment.service";
import { Payment } from "app/models/payment/payment";
import { PaymentMethod } from "app/models/payment/payment-method";
import { OrderService } from "app/services/order.service";
import { CartService } from "app/services/cart.service";
import { CreditCard } from "app/models/payment/credit-card";
import { BranchService } from "app/services/branch.service";
import { Branch } from "app/models/branch/branch";
import { Store } from "app/models/store/store";
import { StoreService } from "app/services/store.service";
import { PagseguroOption } from "app/models/pagseguro/pagseguro-option";
import { PagseguroCreditCard } from "app/models/pagseguro/pagseguro-card";
import { PaymentSelected } from "app/models/payment/checkout-payment";
import { AppSettings } from "app/app.settings";
import { AppTexts } from "app/app.texts";
import { CartManager } from "app/managers/cart.manager";

declare var $: any;
declare var S: any;
declare var swal: any;
declare var PagSeguroDirectPayment: any;

@Component({
    moduleId: module.id,
    selector: 'checkout',
    templateUrl: '../../views/checkout.component.html',
})
export class CheckoutComponent implements OnInit {
    private cart: Cart;
    private logged: boolean = false;
    private customer: Customer;
    private selectedAddress: CustomerAddress;
    private customer_ip = {};
    private showAddresses: boolean = false;
    private intelipost: Intelipost = new Intelipost();
    private shippingSelected: Shipping = new Shipping();
    private payment: Payment = new Payment();
    private payments: Payment[] = [];
    private methodType: number;
    private token: string;
    paymentName: string;

    public readonly mediaPath = `${AppSettings.MEDIA_PATH}/products/`;
    public readonly mediaPathPayments = `${AppSettings.MEDIA_PATH}/payments/`;
    public readonly paymentMethodTypes = AppTexts.PAYMENT_METHOD_TYPES;

    public availableMethodTypes = [];
    creditCard: CreditCard = new CreditCard();
    paymentSelected: Payment = new Payment();
    methodSelected: PaymentMethod = new PaymentMethod();
    optionSelected: PagseguroOption = new PagseguroOption();
    branches: Branch[] = [];
    changeFor: number = null;

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
        private route: ActivatedRoute,
        private parentRouter: Router,
        private http: Http,
        private titleService: Title,
        private manager: CartManager,
        private customerService: CustomerService,
        private cartService: CartService,
        private branchService: BranchService,
        private shippingService: IntelipostService,
        private paymentService: PaymentService,
        private orderService: OrderService,
        private storeService: StoreService,
        private location: Location) {
        window.scrollTo(0, 0); // por causa das hash urls
    }

    ngOnInit() {

        this.storeService.getInfo()
            .then(store => {
                if (store.modality == 0) {
                    this.parentRouter.navigateByUrl('/orcamento');
                }
                else
                    return this.getCustomer();
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
                this.payment = payments.filter(p => p.type == 1)[0];
                this.paymentName = this.payment.name.toLowerCase();
                this.paymentMethodTypes.forEach(t => {
                    if (this.paymentAvailable(t.value)) {
                        this.availableMethodTypes.push(t);
                        return;
                    }
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    ngAfterViewChecked() { }

    ngOnDestroy() { }

    getDiscount() {
        return this.cart.totalDiscountPrice;
    }

    getShipping() {
        return this.cart.totalFreightPrice;
    }

    getSubTotal() {
        return this.cart.totalProductsPrice;
    }

    getTotal() {
        return this.cart.totalPurchasePrice;
    }

    getTotalServices(): number {
        return this.cart.totalServicesPrice;
    }

    getNumItemsInCart() {
        return (this.cart) ? this.cart.products.length : 0;
    }

    selectedAddressOrDefault() {
        if (!this.selectedAddress) {
            this.selectThisAddress(this.customer.addresses.filter(a => a.mainAddress == true)[0], null);
        }

        return this.selectedAddress;
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
                // this.addShippingToCart(null, response.content.delivery_options[0]);
                this.cart.totalFreightPrice = null;

                return this.cartService.addDeliveryAddress(cartId, address.id);
            })
            .then(cart => {
                return this.cartService.addBillingAddress(cartId, address.id);
            })
            .then(cart => {
                this.getBranches(address.zipCode);
            })
            .catch(error => {
                console.log(error);
                if (error.status == 400)
                    swal({
                        title: 'Erro ao calcular o fréte!',
                        text: "Sem opções de entrega viável. Por favor, verifique se os códigos postais estão corretos!",
                        type: 'warning',
                        confirmButtonText: 'OK'
                    });
                else
                    swal('Não foi possível calcular o frete');
            });
    }

    private getCustomer(): Promise<{}> {
        return new Promise((resolve, reject) => {
            if (this.logged) {
                resolve();
            }

            else {
                this.customerService.getUser()
                    .then(customer => {
                        this.customer = customer;
                        this.logged = true;
                        resolve();
                    })
                    .catch((error) => {
                        this.logged = false;
                        reject(error);
                    });
            }
        });
    }

    private paymentAvailable(type: number): boolean {
        let available = false
        // this.payments.forEach(p => {
        //      if(p.paymentMethods.filter(m => m.type == type).length > 0) 
        //         available = true;
        // });
        if (this.payment.paymentMethods.filter(m => m.type == type).length > 0)
            available = true;
        return available;;
    }

    public getPaymentLabel(type) {
        return this.paymentMethodTypes.filter(m => m.value == type)[0].label;
    }

    public isCreditCard() {
        if (this.methodType == 1) return true;
        else return false;
    }

    public isBankSlip() {
        if (this.methodType == 2) return true;
        else return false;
    }

    public isOtherMethods() {
        if (this.methodType == 99) return true;
        else return false;
    }

    public isReadyToCheckout(): boolean {
        if (!this.methodSelected.id && (!this.optionSelected || !this.optionSelected.code))
            return false;
        else if (!this.selectedAddress.id)
            return false;
        else return true;
    }

    public getBankSlips(): PaymentMethod[] {
        let slips = [];
        // this.payments.forEach(p => {
        //     p.paymentMethods.forEach(m => {
        //         if(m.type == 2){
        //             slips.push(m);
        //         }
        //     });
        // });
        this.payment.paymentMethods.forEach(m => {
            if (m.type == 2) {
                slips.push(m);
            }
        });

        return slips;
    }


    public selectMethod(event, method) {
        if (event)
            event.preventDefault();

        this.methodSelected = method;
    }

    public selectType(type) {
        this.methodType = type.value;
    }

    public placeOrder(event) {
        event.preventDefault();

        if (!this.checkoutIsValid()) {
            $('#btn_place-order').button('reset');
            return false;
        }

        if (!this.validChangeFor()) {
            swal({
                title: 'Valor inválido',
                text: 'O valor para troco deve ser maior do que o valor total da compra',
                type: 'warning',
                confirmButtonText: 'OK'
            });
            $('#btn_place-order').button('reset');

            return;
        }

        let cartId = localStorage.getItem('cart_id');
        $('#btn_place-order').button('loading');

        /* Pagamento Offline */
        if (this.paymentSelected.type == 2) {
            this.payWithOfflineMethod(cartId);
        }
        /* Pagamento com cartão de crédito mundipagg */
        else if (this.methodSelected.type == 1) {
            this.payWithMundipaggCreditCard(cartId);
        }
        /* Pagamento com boleto mundipagg */
        else if (this.methodSelected.type == 2) {
            this.payWithMundipaggBankslip(cartId);
        }
        /* Pagamento boleto pagseguro */
        else if (this.optionSelected.code == 202) {
            this.payWithPagseguroBankSlip(cartId);
        }
        /* Pagamento cartão de crédito pagseguro */
        else if (this.optionSelected.code >= 100 && this.optionSelected.code <= 199) {
            this.payWithPagseguroCreditCard(cartId);
        }
    }

    private payWithOfflineMethod(cartId: string) {
        this.orderService.validateOrder(cartId)
            .then(cart => {
                let paymentRef = this.paymentSelected.name.toLowerCase();
                if (paymentRef == 'pagamento na loja') {
                    return this.paymentService.pickUpStoreTransaction(cartId);
                }
                else if (paymentRef = 'pagamento na entrega') {
                    return this.paymentService.delivertPayment(cartId, this.changeFor);
                }
            })
            .then(response => {
                return this.orderService.placeOrder(cartId);
            })
            .then(order => {
                localStorage.removeItem('cart_id');
                this.parentRouter.navigateByUrl(`/checkout/concluido/${order.id}`);
            })
            .catch(error => {
                console.log(error);
                swal({
                    title: 'Erro ao criar o pedido',
                    text: error._body,
                    type: 'error',
                    confirmButtonText: 'OK'
                });
                $('#btn_place-order').button('reset');
            });
    }

    private payWithPagseguroBankSlip(cartId: string) {
        let hash = PagSeguroDirectPayment.getSenderHash();
        this.orderService.validateOrder(cartId)
            .then(cart => {
                return this.paymentService.PagseguroBankSlip(cartId, hash)
            })
            .then(response => {
                return this.orderService.placeOrder(cartId);
            })
            .then(order => {
                localStorage.removeItem('cart_id');
                this.parentRouter.navigateByUrl(`/checkout/concluido/${order.id}`);
            })
            .catch(error => {
                console.log(error);
                swal({
                    title: 'Erro ao criar o pedido',
                    text: error._body,
                    type: 'error',
                    confirmButtonText: 'OK'
                });
                $('#btn_place-order').button('reset');
            });
    }

    private payWithPagseguroCreditCard(cartId: string) {
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
                        let creditCard = new PagseguroCreditCard();
                        creditCard.creditCardToken = this.token;
                        creditCard.holderName = this.creditCard.holderName;
                        creditCard.cpf = this.customer.cpf_Cnpj;
                        creditCard.installmentQuantity = this.creditCard.installmentCount;
                        creditCard.installmentValue = this.creditCard.installmentValue;
                        creditCard.noInterestInstallmentQuantity = this.creditCard.noInterestInstallmentQuantity;

                        return this.paymentService.PagseguroCreditCard(cartId, hash, creditCard)
                    })
                    .then(response => {
                        return this.orderService.placeOrder(cartId);
                    })
                    .then(order => {
                        localStorage.removeItem('cart_id');
                        this.parentRouter.navigateByUrl(`/checkout/concluido/${order.id}`);
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
            }, error: response => {
                console.log(response);
                swal({
                    title: 'Erro ao criar o pedido',
                    text: 'Verifique os dados informados',
                    type: 'error',
                    confirmButtonText: 'OK'
                });
                $('#btn_place-order').button('reset');
            }
        });
    }

    private payWithMundipaggBankslip(cartId: string) {
        this.orderService.validateOrder(cartId)
            .then(cart => {
                return this.paymentService.bankSlipTransaction(cartId);
            })
            .then(response => {
                return this.orderService.placeOrder(cartId);
            })
            .then(order => {
                localStorage.removeItem('cart_id');
                this.parentRouter.navigateByUrl(`/checkout/concluido/${order.id}`);
            })
            .catch(error => {
                swal({
                    title: 'Erro ao criar o pedido',
                    text: error._body,
                    type: 'error',
                    confirmButtonText: 'OK'
                });
                console.log(error);
                $('#btn_place-order').button('reset');
            });
    }

    private payWithMundipaggCreditCard(cartId: string) {
        this.orderService.validateOrder(cartId)
            .then(cart => {
                return this.paymentService.creditCardTransaction(cartId, this.creditCard);
            })
            .then(response => {
                return this.orderService.placeOrder(cartId);
            })
            .then(order => {
                localStorage.removeItem('cart_id');
                this.parentRouter.navigateByUrl(`/checkout/concluido/${order.id}`);
            })
            .catch(error => {
                swal({
                    title: 'Erro ao criar o pedido',
                    text: error._body,
                    type: 'error',
                    confirmButtonText: 'OK'
                });
                console.log(error);
                $('#btn_place-order').button('reset');
            })
    }

    public showMyAddresses(event) {
        event.preventDefault();
        this.showAddresses = !this.showAddresses;

    }

    public checkOption(methodName: string, branch: Branch = null): boolean {
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

    public addShippingToCart(event, intelipostOption: IntelipostDeliveryOption = null, branch: Branch = null) {
        if (event)
            event.preventDefault();
        let shipping = new Shipping();
        let delivery = new DeliveryInformation();

        if (intelipostOption) {
            shipping.shippingType = 2; // TODO [1: Pickup Store; 2: Delivery]
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
            shipping.shippingType = 1;
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
            })

    }

    private addToDate(currentDate, unit, howMuch) {
        // TODO: Remover
        var config = {
            second: 1000, // 1000 miliseconds
            minute: 60000,
            hour: 3600000,
            day: 86400000,
            week: 604800000,
            month: 2592000000, // Assuming 30 days in a month
            year: 31536000000 // Assuming 365 days in year
        };

        var now = new Date(currentDate).getTime();

        return new Date(now + config[unit] * howMuch);
    }

    getCardBrand(cardnumber: string) {
        for (let k in this.regexBrands) {
            if (this.regexBrands[k].test(cardnumber))
                return k;
        }
    }

    detectCard(event) {
        if (event.length == 16) {
            this.creditCard.creditCardBrand = this.getCardBrand(this.creditCard.creditCardNumber);
            if (this.creditCard.creditCardBrand) {
                let cartId = localStorage.getItem('cart_id');
                this.paymentService.simulateInstallments(cartId)
                    .then(payments => {
                        this.methodSelected = payments[0].paymentMethods.filter(m => m.name == this.creditCard.creditCardBrand.toUpperCase())[0]
                    })
                    .catch(error => console.log(error));
            }
        }
        else {
            this.methodSelected.installment = [];
        }
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

    /*Handles*/
    handlePaymentUpdated(event: PaymentSelected) {
        this.methodSelected = event.method;
        this.paymentSelected = event.payment;
        this.optionSelected = event.pagseguro;
    }

    handleCreditCardUpdate(event) {
        this.creditCard = event;
    }

    handlePagseguroUpdated(event) {
        this.optionSelected = event;
    }

    /* Validations */
    validChangeFor() {
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

        if (!this.hasShippingSelected(cartId)) {
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
    hasShippingSelected(cartId: string): boolean {
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
        if (this.methodSelected.id || this.optionSelected.code)
            return true;
        else return false;
    }

    getPaymentTypeSelected() {
        if (this.optionSelected) {
            this.methodSelected = new PaymentMethod();
            this.methodSelected.name = this.optionSelected.name;
            return this.methodSelected;
        }
        else {
            return this.methodSelected;
        }
    }
}

