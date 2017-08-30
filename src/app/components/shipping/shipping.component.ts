import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CartService } from "app/services/cart.service";
import { IntelipostService } from "app/services/intelipost.service";
import { Intelipost } from "app/models/intelipost/intelipost";
import { IntelipostRequest } from "app/models/intelipost/intelipost-request";
import { AppSettings } from "app/app.settings";
import { IntelipostDeliveryOption } from "app/models/intelipost/intelipost-delivery-option";
import { Shipping } from "app/models/shipping/shipping";
import { DeliveryInformation } from "app/models/shipping/delivery-information";
import { Cart } from "app/models/cart/cart";
import { CartManager } from "app/managers/cart.manager";
import { NgProgressService } from "ngx-progressbar";

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'shipping-calc',
    templateUrl: '../../views/shipping.component.html',
    styleUrls: ['../../styles/shipping.component.css']
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
        private loader: NgProgressService
    ) { }

    ngOnInit() {
        if (!this.zipCode && localStorage.getItem('customer_zipcode'))
            this.zipCode = localStorage.getItem('customer_zipcode');
    }

    sendRequest(): Promise<Intelipost> {
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
            if (!this.cartManager.getCartId()) {
                swal({ title: 'Erro!', text: 'Carrinho vazio', type: 'warning', confirmButtonText: 'OK' });
            }
            else {
                this.loader.start();
                this.loading = true;
                this.cartManager.getCart()
                    .then(cart => {
                        if (cart.totalPurchasePrice == 0) {
                            swal({ title: 'Erro!', text: 'Carrinho vazio', type: 'warning', confirmButtonText: 'OK' });
                            this.loader.done();

                            reject(null);
                        }
                        this.loader.start();

                        let request = new IntelipostRequest(this.cartManager.getSessionId(), AppSettings.NAME, AppSettings.ROOT_PATH, zipCode.toString());
                        return this.service.getShipping(request);
                    })
                    .then(response => {
                        this.loader.done();
                        this.loading = false;
                        resolve(response);
                    })
                    .catch(error => {
                        this.loader.done();
                        this.loading = false;
                        reject(error);
                    });
            }
        });
    }

    calculate(event) {
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

    addShippingToCart(event, option: IntelipostDeliveryOption) {
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
        this.cartManager.setShipping(shipping)
            .then(cart => {
                this.cart = cart;
                this.cartUpdated.emit(this.cart);
                this.loading = false;
            })
            .catch(error => {
                swal({ title: 'Erro!', text: 'Não foi possível atualizar o frete', type: 'error', confirmButtonText: 'OK' });
                console.log(error);
                this.loading = false;
            })

    }

    checkOption(option: IntelipostDeliveryOption): boolean {
        if (option.delivery_method_type == this.selected.delivery_method_type)
            return true;
        else return false;

    }

    isMobile(): boolean {
        return AppSettings.isMobile();
    }
}