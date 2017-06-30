import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from "app/components/account/account.component";
import { CustomerService } from "app/services/customer.service";
import { OrderService } from "app/services/order.service";
import { CouponService } from "app/services/coupon.service";
import { RouterModule } from "@angular/router";
import { AccountRoutingModule } from "app/components/account/account-router";
import { AccountHomeModule } from "app/components/account/home/home-panel.module";
import { UserEditModule } from "app/components/account/user-edit-panel/user-edit.module";
import { OrderPanelModule } from "app/components/account/orders-panel/orders-panel.module";
import { MyOrderPanelModule } from "app/components/account/myorder-panel/myorder-panel.module";
import { AddressPanelModule } from "app/components/account/address-panel/address-panel.module";
import { AddressEditModule } from "app/components/account/address-edit-panel/address-edit.module";
import { VouncherPanelModule } from "app/components/account/vouncher-panel/vouncher-panel.module";

@NgModule({
    declarations: [ AccountComponent ],
    imports: [ 
        CommonModule, 
        RouterModule, 
        AccountRoutingModule, 
        AccountHomeModule,
        UserEditModule,
        OrderPanelModule,
        MyOrderPanelModule,
        AddressPanelModule,
        AddressEditModule,
        VouncherPanelModule
    ],
    providers: [ CustomerService, OrderService, CouponService ],
    exports: [ AccountComponent ]
})
export class AccountModule {}