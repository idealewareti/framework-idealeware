import { Component, Input, OnInit, EventEmitter, Output, Inject, PLATFORM_ID } from '@angular/core';
import { CustomerAddress } from '../../../models/customer/customer-address';
import { isPlatformBrowser } from '@angular/common';
import { CustomerManager } from '../../../managers/customer.manager';

declare var swal: any;

@Component({
    selector: 'address-panel-list',
    templateUrl: '../../../templates/account/address-list/address-panel-list.html',
    styleUrls: ['../../../templates/account/address-list/address-panel-list.scss']
})

export class AddressPanelListComponent {
    @Input() address: CustomerAddress;
    @Output() addressDeleted: EventEmitter<CustomerAddress> = new EventEmitter<CustomerAddress>();

    constructor(
        private customerManager: CustomerManager,
        @Inject(PLATFORM_ID) private platformId: Object, ) {
        this.address = new CustomerAddress();
    }

    askForDelete() {
        if (isPlatformBrowser(this.platformId)) {
            swal({
                title: 'Apagar endereço',
                text: `Deseja excluir o endereço ${this.address.addressName}?`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não'
            }, function (this) {
                return new Promise((resolve, reject) => {
                    resolve()
                })
            }, function () {
            })
                .then(() => this.delete());
        }
    }

    private delete() {
        if (isPlatformBrowser(this.platformId)) {
            this.customerManager.deleteAddress(this.address.id)
                .subscribe(() => {
                    swal('Endereço removido');
                    this.addressDeleted.emit(this.address);
                }, error => {
                    swal('Falha ao remover o endereço', error, 'error');
                });
        }
    }
}