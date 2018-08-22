import { Component, OnInit, Input } from '@angular/core';
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
        private customerManager: CustomerManager) {
    }

    ngOnInit() {
        this.customerManager.getUser()
            .subscribe(customer => {
                this.addresses = customer.addresses;
            }), (err => {
                swal('Não foi possível acessar obter os endereços', err.error, "error");
            });
    }

    handleAdressDeleted(event) {
        let address = event;
        let index = this.addresses.findIndex(a => a.id == address.id);

        if (index > -1) {
            this.addresses.splice(index, 1);
        }
    }

}