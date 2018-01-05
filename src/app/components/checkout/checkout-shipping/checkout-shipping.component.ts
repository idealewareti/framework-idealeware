import { Component, OnInit, EventEmitter, Output, AfterContentChecked, SimpleChanges, Input, OnChanges, PLATFORM_ID, Inject } from '@angular/core';
import { Intelipost } from '../../../models/intelipost/intelipost';
import { IntelipostService } from '../../../services/intelipost.service';
import { Globals } from '../../../models/globals';
import { IntelipostRequest } from '../../../models/intelipost/intelipost-request';
import { CustomerAddress } from '../../../models/customer/customer-address';
import { CartManager } from '../../../managers/cart.manager';
import { IntelipostDeliveryOption } from '../../../models/intelipost/intelipost-delivery-option';
import { Branch } from '../../../models/branch/branch';
import { DeliveryInformation } from '../../../models/shipping/delivery-information';
import { Shipping } from '../../../models/shipping/shipping';
import { EnumShippingType } from '../../../enums/shipping-type.enum';
import { BranchService } from '../../../services/branch.service';
import { Cart } from '../../../models/cart/cart';
import { isPlatformBrowser } from '@angular/common';

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'app-checkout-shipping',
    templateUrl: '../../../template/checkout/checkout-shipping/checkout-shipping.html',
    styleUrls: ['../../../template/checkout/checkout-shipping/checkout-shipping.scss']
})
export class CheckoutShippingComponent implements OnChanges {
    intelipost: Intelipost = new Intelipost();
    @Input() deliveryAddress: CustomerAddress
    branches: Branch[] = [];
    shippingSelected: Shipping = new Shipping();

    @Output() shippingUpdated: EventEmitter<Shipping> = new EventEmitter<Shipping>();

    constructor(
        private shippingService: IntelipostService,
        private globals: Globals,
        private manager: CartManager,
        private branchService: BranchService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if ((changes['deliveryAddress'] && changes.deliveryAddress.firstChange) || (changes.deliveryAddress.previousValue.id != changes.deliveryAddress.currentValue.id))
            this.calculateShipping(this.deliveryAddress);
    }

    /**
     * Calcula o frete na intelipost com o endereço selecionado
     * 
     * @param {CustomerAddress} address 
     * @memberof CheckoutShippingComponent
     */
    calculateShipping(address: CustomerAddress) {
        if (isPlatformBrowser(this.platformId)) {
            if (address.zipCode) {
                let cartId = this.globals.cart.id;
                let request = new IntelipostRequest(null, null, null, address.zipCode);
                this.shippingService.getShipping(request, localStorage.getItem('cart_id'))
                    .then(response => {
                        this.intelipost = response;
                        return this.addShippingToCart(null, this.intelipost.content.delivery_options[0]);
                    })
                    .then(cart => {
                    })
                    .catch(error => {
                        console.log(error);
                        let body = JSON.parse(error.text());
                        let response = JSON.parse(body)
                        let message = response.messages[0].text;
                        swal('Erro', message, 'warning');
                    });

                this.getBranches(address.zipCode);
            }
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
                delivery.shippingCost = this.shippingCost(intelipostOption);
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

            if (isPlatformBrowser(this.platformId)) {
                this.manager.setShipping(shipping, localStorage.getItem('cart_id'))
                    .then(cart => {
                        this.globals.cart = cart;
                        this.shippingSelected = shipping;
                        this.shippingUpdated.emit(shipping);
                        resolve(cart);
                    })
                    .catch(error => {
                        swal({ title: 'Erro!', text: 'Não foi possível atualizar o frete', type: 'error', confirmButtonText: 'OK' });
                        reject(error);
                    });
            }

        });
    }

    /**
     * Adiciona tempo à data
     * 
     * @private
     * @param {any} currentDate 
     * @param {any} unit 
     * @param {any} howMuch 
     * @returns 
     * @memberof CheckoutShippingComponent
     */
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
}
