import { Component, Input, OnInit, EventEmitter, Output, Inject, PLATFORM_ID } from '@angular/core';
import { CustomerAddress } from '../../../models/customer/customer-address';
import { CustomerService } from '../../../services/customer.service';
import { isPlatformBrowser } from '@angular/common';
import { Token } from '../../../models/customer/token';

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'app-address-panel-list',
    templateUrl: '../../../template/account/address-list/address-panel-list.html',
    styleUrls: ['../../../template/account/address-list/address-panel-list.scss']
})

export class AddressPanelListComponent implements OnInit {
    @Input() address: CustomerAddress;
    @Output() addressDeleted: EventEmitter<CustomerAddress> = new EventEmitter<CustomerAddress>();

    constructor(private service: CustomerService,
        @Inject(PLATFORM_ID) private platformId: Object, ) {
        this.address = new CustomerAddress();
    }

    ngOnInit() { }

    private getToken(): Token {
        let token = new Token();
        if (isPlatformBrowser(this.platformId)) {
            token = new Token();
            token.accessToken = localStorage.getItem('auth');
            token.createdDate = new Date(localStorage.getItem('auth_create'));
            token.expiresIn = Number(localStorage.getItem('auth_expires'));
            token.tokenType = 'Bearer';
        }
        return token;
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
                .then(() => this.delete())
                .catch(error => console.log(error));
        }
    }

    private delete() {
        if (isPlatformBrowser(this.platformId)) {
            let token: Token = this.getToken();
            this.service.deleteAddress(this.address.id, token)
                .then(() => {
                    swal('Endereço removido');
                    this.addressDeleted.emit(this.address);
                })
                .catch(error => {
                    swal('Falha ao remover o endereço', error, 'error');
                });
        }
    }
}