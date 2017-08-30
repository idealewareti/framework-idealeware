import { Component, OnInit } from '@angular/core';
import { Customer } from "app/models/customer/customer";
import { Coupon } from "app/models/coupon/coupon";
import { CouponService } from "app/services/coupon.service";
import { CustomerService } from "app/services/customer.service";
import { Title } from "@angular/platform-browser";
import { AppSettings } from "app/app.settings";

@Component({
    moduleId: module.id,
    selector: 'vouncher-panel',
    templateUrl: '../../../views/vouncher-panel.component.html',
})
export class VouncherPanelComponent implements OnInit {
    private customer: Customer;
    coupons: Coupon[] = [];
    
    constructor(private service: CouponService, private customerService: CustomerService, private titleService: Title) { }

    ngOnInit() {
        AppSettings.setTitle('Meus Cupons', this.titleService);

        this.customerService.getUser()
        .then(customer => {
            return this.service.getCouponsFromCustomer(customer.id);
        })
        .then(coupons => this.coupons = coupons)
        .catch(error => console.log(error));
     }
}