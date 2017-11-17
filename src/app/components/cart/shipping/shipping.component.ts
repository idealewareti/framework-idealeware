import { Component, OnInit, Input, EventEmitter, Output, Inject, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { CartService } from "../../../services/cart.service";
import { IntelipostService } from "../../../services/intelipost.service";
import { Intelipost } from "../../../models/intelipost/intelipost";
import { IntelipostRequest } from "../../../models/intelipost/intelipost-request";
import { IntelipostDeliveryOption } from "../../../models/intelipost/intelipost-delivery-option";
import { Shipping } from "../../../models/shipping/shipping";
import { DeliveryInformation } from "../../../models/shipping/delivery-information";
import { Cart } from "../../../models/cart/cart";
import { CartManager } from "../../../managers/cart.manager";
import { Globals } from '../../../models/globals';
import { isPlatformBrowser } from '@angular/common';
import { AppConfig } from '../../../app.config';
import { AppCore } from '../../../app.core';

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'app-shipping-calc',
    templateUrl: '../../../template/cart/shipping/shipping.html',
    styleUrls: ['../../../template/cart/shipping/shipping.scss']
})
export class ShippingCalcComponent implements OnInit {
    private intelipost: Intelipost;
    private deliveryOptions: IntelipostDeliveryOption[] = [];
    private selected: IntelipostDeliveryOption = new IntelipostDeliveryOption();
    @Input() zipCode: string;
    @Input() cart: Cart;
    @Output() cartUpdated: EventEmitter<Cart> = new EventEmitter<Cart>();

    loading: boolean = false;

    constructor(
        private service: IntelipostService,
        private cartManager: CartManager,
        private globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.zipCode && localStorage.getItem('customer_zipcode'))
                this.zipCode = localStorage.getItem('customer_zipcode');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['cart'] && !changes.cart.firstChange) {
            if (changes.cart.currentValue.shipping == null) {
                this.deliveryOptions = [];
            }
        }
    }

    sendRequest(): Promise<Intelipost> {
        if (isPlatformBrowser(this.platformId)) {

            return new Promise((resolve, reject) => {
                if (!this.zipCode) {
                    swal({ title: 'Erro!', text: 'CEP Inválido', type: 'warning', confirmButtonText: 'OK' });
                    reject(null);
                }
                else if (this.zipCode.length < 9) {
                    swal({ title: 'Erro!', text: 'CEP Inválido', type: 'warning', confirmButtonText: 'OK' });
                    reject(null);
                }

                let zipCode = Number(this.zipCode.replace('-', ''));
                if (!localStorage.getItem('cart_id')) {
                    swal({ title: 'Erro!', text: 'Carrinho vazio', type: 'warning', confirmButtonText: 'OK' });
                }
                else {
                    this.loading = true;
                    this.cartManager.getCart(localStorage.getItem('cart_id').toString())
                        .then(cart => {
                            if (cart.totalPurchasePrice == 0) {
                                swal({ title: 'Erro!', text: 'Carrinho vazio', type: 'warning', confirmButtonText: 'OK' });
                                reject(null);
                            }

                            let request = new IntelipostRequest(
                                localStorage.getItem('session_id'),
                                AppConfig.NAME,
                                this.globals.store.link,
                                zipCode.toString());
                            return this.service.getShipping(request, localStorage.getItem('cart_id'));
                        })
                        .then(response => {
                            this.loading = false;
                            resolve(response);
                        })
                        .catch(error => {
                            this.loading = false;
                            reject(error);
                        });
                }
            });
        }
    }

    calculate(event) {
        if (isPlatformBrowser(this.platformId)) {
            event.preventDefault();
            this.deliveryOptions = [];
            this.loading = true;
            this.sendRequest()
                .then(response => {
                    this.intelipost = response;
                    this.deliveryOptions = this.intelipost.content.delivery_options;
                    this.loading = false;
                })
                .catch(error => {
                    if (error.status == 400)
                        swal({
                            title: 'Erro ao calcular o frete!',
                            text: "Sem opções de entrega viável. Por favor, verifique se os códigos postais estão corretos!",
                            type: 'warning',
                            confirmButtonText: 'OK'
                        });
                    else
                        swal({ title: 'Erro!', text: 'Não foi possível calcular o frete', type: 'error', confirmButtonText: 'OK' });
                    console.log(error);
                    this.loading = false;
                });
        }
    }

    addShippingToCart(event, option: IntelipostDeliveryOption) {
        if (isPlatformBrowser(this.platformId)) {
            event.preventDefault();
            this.selected = option;
            let shipping = new Shipping();
            shipping.shippingType = 2; // TODO
            let delivery = new DeliveryInformation();
            delivery.quotId = this.intelipost.content.id.toString();
            delivery.deliveryMethodId = option.delivery_method_id.toString();
            delivery.shippingCost = option.final_shipping_cost;
            delivery.deliveryMethodName = option.delivery_method_name;
            delivery.deliveryProviderName = option.logistic_provider_name;
            delivery.deliveryEstimateBusinessDays = option.delivery_estimate_business_days;

            shipping.deliveryInformation = delivery;
            this.loading = true;
            this.cartManager.setShipping(shipping, localStorage.getItem('cart_id'))
                .then(cart => {
                    this.cart = cart;
                    this.globals.cart = cart;
                    this.cartUpdated.emit(this.cart);
                    this.loading = false;
                })
                .catch(error => {
                    swal({ title: 'Erro!', text: 'Não foi possível atualizar o frete', type: 'error', confirmButtonText: 'OK' });
                    console.log(error);
                    this.loading = false;
                });
        }
    }

    checkOption(option: IntelipostDeliveryOption): boolean {
        if (option.delivery_method_id == this.selected.delivery_method_id)
            return true;
        else return false;

    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }
}