import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-router';
import { AccountHomeModule } from './home/home-panel.module';
import { UserEditModule } from './user-edit-panel/user-edit.module';
import { MyOrderPanelModule } from './myorder-panel/myorder-panel.module';
import { OrderPanelModule } from './orders-panel/orders-panel.module';
import { AddressEditModule } from './address-edit-panel/address-edit.module';
import { AddressPanelModule } from './address-panel/address-panel.module';
import { VouncherPanelModule } from './vouncher-panel/vouncher-panel.module';
import { CustomerService } from '../../services/customer.service';
import { OrderService } from '../../services/order.service';
import { CouponService } from '../../services/coupon.service';


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