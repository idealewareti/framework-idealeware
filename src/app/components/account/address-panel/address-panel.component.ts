import { Component, OnInit, Input, PLATFORM_ID, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Customer } from '../../../models/customer/customer';
import { CustomerAddress } from '../../../models/customer/customer-address';
import { CustomerService } from '../../../services/customer.service';
import { Title } from "@angular/platform-browser";
import { isPlatformBrowser } from '@angular/common';
import { Token } from '../../../models/customer/token';
import { FormGroup } from '@angular/forms';

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'app-address-panel',
    templateUrl: '../../../template/account/address-panel/address-panel.html',
    styleUrls: ['../../../template/account/address-panel/address-panel.scss']
})
export class AddressPanelComponent implements OnInit {
    @Input() tabId: string;
    addresses: CustomerAddress[] = [];
    myForm: FormGroup;

    constructor(private service: CustomerService, private titleService: Title,
        @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            let token: Token = this.getToken();
            this.service.getUser(token)
                .subscribe(customer => {
                    this.addresses = customer.addresses;
                    this.titleService.setTitle('Meus Endereços');
                }), (error => {
                    swal('Não foi possível acessar obter os endereços', error.text(), "error");
                    console.log(error);
                })
        }
    }

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

    private isNewOrEdit() {
        if (this.tabId) {
            return true;
        }
        else return false;
    }

    handleAdressDeleted(event) {
        let address = new CustomerAddress(event);
        let index = this.addresses.findIndex(a => a.id == address.id);

        if (index > -1) {
            this.addresses.splice(index, 1);
        }
    }

}