import { Component, OnInit, Input, Inject, PLATFORM_ID  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CustomerAddress } from '../../../models/customer/customer-address';
import { CustomerManager } from '../../../managers/customer.manager';

declare var swal: any;

@Component({
    selector: 'address-panel',
    templateUrl: '../../../templates/account/address-panel/address-panel.html',
    styleUrls: ['../../../templates/account/address-panel/address-panel.scss']
})
export class AddressPanelComponent implements OnInit {

    addresses: CustomerAddress[] = [];

    constructor(
        private customerManager: CustomerManager,
        @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.customerManager.getUser()
                .subscribe(customer => {
                    this.addresses = customer.addresses;
                }), (err => {
                    swal('Não foi possível acessar obter os endereços', err.error, "error");
                });
        }
    }

    handleAdressDeleted(event) {
        if (isPlatformBrowser(this.platformId)) {
            let address = event;
            let index = this.addresses.findIndex(a => a.id == address.id);

            if (index > -1) {
                this.addresses.splice(index, 1);
            }
        }
    }

}