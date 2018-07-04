import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Customer } from "../../../models/customer/customer";
import { Coupon } from "../../../models/coupon/coupon";
import { CouponService } from "../../../services/coupon.service";
import { CustomerService } from "../../../services/customer.service";
import { Title } from "@angular/platform-browser";
import { Token } from '../../../models/customer/token';
import { isPlatformBrowser } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-vouncher-panel',
    templateUrl: '../../../template/account/vouncher-panel/vouncher-panel.html',
    styleUrls: ['../../../template/account/vouncher-panel/vouncher-panel.scss']
})
export class VouncherPanelComponent implements OnInit {
    private customer: Customer;
    coupons: Coupon[] = [];

    constructor(
        private service: CouponService,
        private customerService: CustomerService,
        private titleService: Title,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
        this.titleService.setTitle('Meus Cupons');
            let token: Token = this.getToken();
            this.customerService.getUser(token)
                .subscribe(customer => {
                    this.service.getCouponsFromCustomer(customer.id)
                        .subscribe(coupons => this.coupons = coupons),
                        error => console.log(error);
                }), error => console.log(error);
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
}