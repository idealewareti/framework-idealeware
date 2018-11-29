import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CustomerAddress } from '../../../models/customer/customer-address';
import { CustomerManager } from '../../../managers/customer.manager';
import { Router } from '@angular/router';

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
        private parentRouter: Router,
        @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.customerManager.getUser()
                .subscribe(customer => {
                    this.addresses = customer.addresses;
                }, error => {
                    swal('Erro', 'Não foi possível obter os endereços', 'error')
                        .then(() => this.parentRouter.navigateByUrl('/'));
                    throw new Error(`${error.error} Status: ${error.status}`);
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