import { Component, OnInit, Input, EventEmitter, Output, Inject, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Intelipost } from "../../../models/intelipost/intelipost";
import { IntelipostRequest } from "../../../models/intelipost/intelipost-request";
import { IntelipostDeliveryOption } from "../../../models/intelipost/intelipost-delivery-option";
import { Shipping } from "../../../models/shipping/shipping";
import { DeliveryInformation } from "../../../models/shipping/delivery-information";
import { Cart } from "../../../models/cart/cart";
import { CartManager } from "../../../managers/cart.manager";
import { AppConfig } from '../../../app.config';
import { AppCore } from '../../../app.core';
import { Branch } from '../../../models/branch/branch';
import { EnumShippingType } from '../../../enums/shipping-type.enum';
import { Store } from '../../../models/store/store';
import { IntelispostManager } from '../../../managers/intelispost.manager';
import { StoreManager } from '../../../managers/store.manager';
import { BranchManager } from '../../../managers/branch.manager';

declare var swal: any;

@Component({
    selector: 'shipping-calc',
    templateUrl: '../../../templates/cart/shipping/shipping.html',
    styleUrls: ['../../../templates/cart/shipping/shipping.scss']
})
export class ShippingCalcComponent implements OnInit {
    formShipping: FormGroup;

    private intelipost: Intelipost;
    private deliveryOptions: IntelipostDeliveryOption[] = [];
    private branches: Branch[] = [];
    private shippingSelected: Shipping = new Shipping();
    private store: Store;

    @Input() cart: Cart;
    @Output() cartUpdated: EventEmitter<Cart> = new EventEmitter<Cart>();

    loading: boolean = false;

    constructor(
        private intelipostManager: IntelispostManager,
        private cartManager: CartManager,
        private branchManager: BranchManager,
        private storeManager: StoreManager,
        private formBuilder: FormBuilder,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.getStore();
            this.formShipping = this.formBuilder.group({
                zipCode: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(9)
                    ]
                ]
            });
        }
    }

    /**
     * Selecionar loja acessada
     */
    getStore(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.storeManager.getStore()
                .subscribe(store => this.store = store);
        }
    }

    /**
     * Listar fretes disponiveis quando o usuário clicar no button
     */
    calculate() {
        if (isPlatformBrowser(this.platformId)) {
            this.loading = true;
            const zipCode = this.formShipping.get('zipCode').value;
            this.intelipostManager.getShipping(
                new IntelipostRequest(
                    localStorage.getItem('session_id'),
                    AppConfig.NAME,
                    this.store.link,
                    zipCode.toString()),
                this.cartManager.getCartId())
                .subscribe(intelipost => {
                    this.intelipost = intelipost;
                    this.deliveryOptions = intelipost.content.delivery_options;
                    this.loading = false;
                }, err => {
                    if (err.status == 400)
                        swal({
                            title: 'Erro ao calcular o frete!',
                            text: "Sem opções de entrega viável. Por favor, verifique se os códigos postais estão corretos!",
                            type: 'warning',
                            confirmButtonText: 'OK'
                        });
                    else
                        swal({ title: 'Erro!', text: 'Não foi possível calcular o frete', type: 'error', confirmButtonText: 'OK' });
                    this.loading = false;
                });
            this.getBranches(zipCode);
        }
    }

    /**
     * Obtem as filiais
     * 
     * @param {string} zipcode 
     * @memberof CheckoutShippingComponent
     */
    getBranches(zipcode: string) {
        if (isPlatformBrowser(this.platformId)) {
            zipcode = zipcode.replace('-', '');
            this.branchManager.getBranches(zipcode)
                .subscribe(branches => {
                    this.branches = branches;
                });
        }
    }

    /**
     * Seleciona o frete escolhido
     * @param intelipostOption 
     */
    addShippingIntelipostToCart(intelipostOption: IntelipostDeliveryOption) {
        if (isPlatformBrowser(this.platformId)) {
            let shipping = new Shipping();
            let delivery = new DeliveryInformation();

            delivery.quotId = this.intelipost.content.id.toString();
            delivery.deliveryMethodId = intelipostOption.delivery_method_id.toString();
            delivery.shippingCost = intelipostOption.final_shipping_cost;
            delivery.deliveryMethodName = intelipostOption.delivery_method_name;
            delivery.deliveryProviderName = intelipostOption.logistic_provider_name;
            delivery.deliveryEstimateBusinessDays = intelipostOption.delivery_estimate_business_days;

            shipping.shippingType = EnumShippingType.Delivery;
            shipping.deliveryInformation = delivery;

            this.setShipping(shipping);
        }
    }

    /**
     * Seleciona a retirada na loja escolhida
     * @param branch 
     */
    addShippingBranchToCart(branch: Branch) {
        if (isPlatformBrowser(this.platformId)) {
            let shipping = new Shipping();
            let delivery = new DeliveryInformation();

            delivery.quotId = branch.id;
            delivery.deliveryMethodId = branch.id;
            delivery.deliveryMethodName = 'Retirar na Loja';
            delivery.shippingCost = 0.0;
            delivery.deliveryProviderName = branch.name;
            delivery.deliveryEstimateBusinessDays = branch.deliveryTime;
            delivery.shippingCost = branch.value;

            shipping.shippingType = EnumShippingType.PickuUpStore;
            shipping.branch = branch;
            shipping.deliveryInformation = delivery;

            this.setShipping(shipping);
        }
    }

    /**
     * Persistir o frete escolhido
     * @param shipping 
     */
    setShipping(shipping: Shipping) {
        if (isPlatformBrowser(this.platformId)) {
            this.cartManager.setShipping(shipping, this.cartManager.getCartId())
                .subscribe(cart => {
                    this.cart = cart;
                    this.shippingSelected = shipping;
                    this.cartUpdated.emit(this.cart);
                    this.loading = false;
                }, err => {
                    swal({ title: 'Erro!', text: 'Não foi possível atualizar o frete', type: 'error', confirmButtonText: 'OK' });
                    this.loading = false;
                });
        }
    }

    /**
     * Habilita retirada na loja
     * @returns {Branch[]} 
     * @memberof CheckoutShippingComponent
     */
    allowPickUpStore(): Branch[] {
        if (isPlatformBrowser(this.platformId)) {
            return this.branches.filter(b => b.allowPickupStore);
        }
    }

    /**
     * Marca a opção de frete selecionada
     * @param {string} methodName 
     * @param {Branch} [branch=null] 
     * @returns {boolean} 
     * @memberof CheckoutShippingComponent
     */
    checkOption(methodName: string, branch: Branch = null): boolean {
        if (isPlatformBrowser(this.platformId)) {
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
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }
}