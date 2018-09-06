import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Coupon } from "../../../models/coupon/coupon";
import { CustomerManager } from '../../../managers/customer.manager';
import { CouponManager } from '../../../managers/coupon.manager';

@Component({
    selector: 'vouncher-panel',
    templateUrl: '../../../templates/account/vouncher-panel/vouncher-panel.html',
    styleUrls: ['../../../templates/account/vouncher-panel/vouncher-panel.scss']
})
export class VouncherPanelComponent implements OnInit {

    coupons: Coupon[] = [];

    constructor(
        private couponManager: CouponManager,
        private customerManager: CustomerManager,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.customerManager.getUser()
                .subscribe(customer => {
                    this.couponManager.getCouponsFromCustomer(customer.id)
                        .subscribe(coupons => this.coupons = coupons);
                });
        }
    }
}