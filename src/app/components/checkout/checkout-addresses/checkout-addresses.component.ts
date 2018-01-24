import { Component, OnInit, Input, Output, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { CustomerAddress } from '../../../models/customer/customer-address';
import { Cart } from '../../../models/cart/cart';
import { Globals } from '../../../models/globals';
import { CartManager } from '../../../managers/cart.manager';
import { isPlatformBrowser } from '@angular/common';

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'app-checkout-addresses',
    templateUrl: '../../../template/checkout/checkout-addresses/checkout-addresses.html',
    styleUrls: ['../../../template/checkout/checkout-addresses/checkout-addresses.html']
})
export class CheckoutAddressesComponent implements OnInit {

    @Input() addresses: CustomerAddress[] = [];
    @Output() addressUpdated: EventEmitter<CustomerAddress[]> = new EventEmitter<CustomerAddress[]>();

    showBillingAddresses: boolean = false;
    showShippingAddresses: boolean = false;
    retryBillingAddress: boolean = true;
    retryShippingAddress: boolean = true;

    constructor(
        private globals: Globals,
        private cartManager: CartManager,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    /*
    ** Lifecycles
    */
    ngOnInit() {
        this.setBillingAddress(this.getFirstOrDefault())
            .then(cart => {
                return this.setShippingAddress(this.getFirstOrDefault());
            });
    }

    /*
    ** Helpers
    */
    billingAddressOrDefault(): CustomerAddress {
        return this.globals.cart.billingAddress;
    }

    shippingAddressOrDefault(): CustomerAddress {
        return this.globals.cart.deliveryAddress;
    }

    showMyAddresses(event, isBillingAddress: boolean = false) {
        event.preventDefault();
        if (isBillingAddress)
            this.showBillingAddresses = !this.showBillingAddresses;
        else
            this.showShippingAddresses = !this.showShippingAddresses;
    }

    //     /*
    //     ** Getters
    //     */

    /**
     * Retorna o endereço padrão ou o primeiro da lista
     * 
     * @returns {CustomerAddress} 
     * @memberof CheckoutAddressesComponent
     */
    getFirstOrDefault(): CustomerAddress {
        if (this.addresses.findIndex(a => a.mainAddress == true) >= 0)
            return this.addresses.find(a => a.mainAddress == true)
        else return this.addresses[0];
    }

    //     /*
    //     ** Setters
    //     */

    /**
     * Seleciona o endereço de cobrança
     * 
     * @param {CustomerAddress} address 
     * @returns {*} 
     * @memberof CheckoutAddressesComponent
     */
    setBillingAddress(address: CustomerAddress, event = null): Promise<Cart> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise((resolve, reject) => {
                if (event) {
                    event.preventDefault();
                    this.retryBillingAddress = true;
                }
                if (this.retryBillingAddress) {
                    this.globals.cart.billingAddress = address;
                    this.cartManager.addBillingAddress(this.globals.cart.id, address.id)
                        .then(cart => {
                            this.showBillingAddresses = false;
                            this.retryBillingAddress = false;
                            resolve(cart);
                        })
                        .catch(error => {
                            this.retryBillingAddress = false;
                            console.log(error);
                            swal({
                                title: 'Erro ao definir o endereço de cobrança',
                                text: error.text(),
                                type: 'error',
                                showCancelButton: true,
                                confirmButtonText: 'Tentar novamente',
                                cancelButtonText: 'Cancelar',
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                            })
                                .then(() => {
                                    this.retryBillingAddress = true;
                                    this.setBillingAddress(address);
                                });
                            reject(error);
                        });
                }
            });
        }
    }

    /**
     * Seleciona o endereço de entrega
     * 
     * @param {CustomerAddress} address 
     * @returns {*} 
     * @memberof CheckoutAddressesComponent
     */
    setShippingAddress(address: CustomerAddress, event = null): Promise<Cart> {
        if (isPlatformBrowser(this.platformId)) {

            return new Promise((resolve, reject) => {
                if (event) {
                    event.preventDefault();
                    this.retryShippingAddress = true;
                }
                if (this.retryShippingAddress) {
                    this.globals.cart.deliveryAddress = address;
                    this.cartManager.addDeliveryAddress(this.globals.cart.id, address.id)
                        .then(cart => {
                            this.showShippingAddresses = false;
                            this.retryShippingAddress = false;
                            resolve(cart);
                        })
                        .catch(error => {
                            this.retryShippingAddress = false;
                            console.log(error);
                            swal({
                                title: 'Erro ao definir o endereço de entrega',
                                text: error.text(),
                                type: 'error',
                                showCancelButton: true,
                                confirmButtonText: 'Tentar novamente',
                                cancelButtonText: 'Cancelar',
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                            })
                                .then(() => {
                                    this.retryShippingAddress = true;
                                    this.setShippingAddress(address);
                                });
                            reject(error);
                        });
                }
            });
        }
    }

}