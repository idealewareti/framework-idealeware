import { Component, OnInit } from '@angular/core';
import { Customer } from "../../_models/customer/customer";
import { Coupon } from "../../_models/coupon/coupon";
import { CouponService } from "../../_services/coupon.service";
import { CustomerService } from "../../_services/customer.service";

@Component({
    moduleId: module.id,
    selector: 'vouncher-panel',
    templateUrl: '/views/vouncher-panel.component.html',
})
export class VouncherPanelComponent implements OnInit {
    private customer: Customer;
    coupons: Coupon[] = [];
    
    constructor(private service: CouponService, private customerService: CustomerService) { }

    ngOnInit() {
        this.customerService.getUser()
        .then(customer => {
            return this.service.getCouponsFromCustomer(customer.id);
        })
        .then(coupons => this.coupons = coupons)
        .catch(error => console.log(error));
     }
}