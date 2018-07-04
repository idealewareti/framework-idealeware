import { Component, OnInit, Input, EventEmitter, Output, Inject, PLATFORM_ID, SimpleChanges } from '@angular/core';
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
import { Branch } from '../../../models/branch/branch';
import { BranchService } from '../../../services/branch.service';
import { EnumShippingType } from '../../../enums/shipping-type.enum';

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
    private branches: Branch[] = [];
    private shippingSelected: Shipping = new Shipping();
    @Input() zipCode: string;
    @Input() cart: Cart;
    @Output() cartUpdated: EventEmitter<Cart> = new EventEmitter<Cart>();

    loading: boolean = false;

    constructor(
        private service: IntelipostService,
        private branchService: BranchService,
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
        if (isPlatformBrowser(this.platformId)) {
            if (changes['cart'] && !changes.cart.firstChange) {
                if (changes.cart.currentValue.shipping == null) {
                    this.deliveryOptions = [];
                    this.branches = [];
                }
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
                            if (cart.products.length == 0) {
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
            this.branches = [];
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
            this.getBranches(this.zipCode);
        }
    }

    /**
     * Adiciona o frete selecionado ao carrinho
     * 
     * @param {any} event 
     * @param {IntelipostDeliveryOption} [intelipostOption=null] 
     * @param {Branch} [branch=null] 
     * @returns {Promise<Cart>} 
     * @memberof CheckoutShippingComponent
     */
    addShippingToCart(event, intelipostOption: IntelipostDeliveryOption = null, branch: Branch = null): Promise<Cart> {
        return new Promise((resolve, reject) => {
            if (event)
                event.preventDefault();
            let shipping = new Shipping();
            let delivery = new DeliveryInformation();

            if (intelipostOption) {
                shipping.shippingType = EnumShippingType.Delivery;
                delivery.quotId = this.intelipost.content.id.toString();
                delivery.deliveryMethodId = intelipostOption.delivery_method_id.toString();
                //delivery.shippingCost = this.shippingCost(intelipostOption);
                console.log(intelipostOption);
                delivery.shippingCost = intelipostOption.final_shipping_cost;
                delivery.deliveryMethodName = intelipostOption.delivery_method_name;
                delivery.deliveryProviderName = intelipostOption.logistic_provider_name;
                delivery.deliveryEstimateBusinessDays = intelipostOption.delivery_estimate_business_days;
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
                shipping.deliveryInformation = delivery;
            }

            this.cartManager.setShipping(shipping, localStorage.getItem('cart_id'))
                .then(cart => {
                    this.cart = cart;
                    this.globals.cart = cart;
                    this.shippingSelected = shipping;
                    this.cartUpdated.emit(this.cart);
                    this.loading = false;
                })
                .catch(error => {
                    swal({ title: 'Erro!', text: 'Não foi possível atualizar o frete', type: 'error', confirmButtonText: 'OK' });
                    console.log(error);
                    this.loading = false;
                });
        });
    }

    /**
     * Obtem as filiais
     * 
     * @param {string} zipcode 
     * @memberof CheckoutShippingComponent
     */
    getBranches(zipcode: string) {
        zipcode = zipcode.replace('-', '');
        this.branchService.getBranches(zipcode)
            .subscribe(branches => {
                this.branches = branches;
            }, error => console.log(error));
    }

    /**
     * Habilita retirada na loja
     * 
     * @returns {Branch[]} 
     * @memberof CheckoutShippingComponent
     */
    allowPickUpStore(): Branch[] {
        return this.branches.filter(b => b.allowPickupStore);
    }

    /**
     * Marca a opção de frete selecionada
     * 
     * @param {string} methodName 
     * @param {Branch} [branch=null] 
     * @returns {boolean} 
     * @memberof CheckoutShippingComponent
     */
    checkOption(methodName: string, branch: Branch = null): boolean {
        if (methodName) {
            if (!this.shippingSelected)
                return false
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

    shippingCost(deliveryOption: IntelipostDeliveryOption): number {
        if (deliveryOption.final_shipping_cost < deliveryOption.provider_shipping_cost)
            return deliveryOption.final_shipping_cost;
        else return deliveryOption.provider_shipping_cost;
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }
}