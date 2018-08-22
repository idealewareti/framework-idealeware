import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { AccountComponent } from './account.component';
import { AccountHomeComponent } from './home/home-panel.component';
import { UserEditComponent } from './user-edit-panel/user-edit.component';
import { AddressPanelComponent } from './address-panel/address-panel.component';
import { MyOrderPanelComponent } from './myorder-panel/myorder-panel.component';
import { AddressEditComponent } from './address-edit-panel/address-edit.component';
import { OrderPanelComponent } from './orders-panel/orders-panel.component';
import { VouncherPanelComponent } from './vouncher-panel/vouncher-panel.component';
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
import { AuthGuard } from '../../guards/auth.guard';


@NgModule({
    declarations: [ AccountComponent ],
    imports: [ 
        RouterModule.forChild([
            {
              path: '', component: AccountComponent, canActivate: [AuthGuard],
              children: [
                { path: '', component: AccountHomeComponent, data: { name: 'Account' } },
                { path: 'home', component: AccountHomeComponent, data: { name: 'Account' } },
                { path: 'dados-cadastrais', component: UserEditComponent, data: { name: 'Account' } },
                { path: 'enderecos', component: AddressPanelComponent, data: { name: 'Account' } },
                { path: 'enderecos/:id', component: AddressEditComponent, data: { name: 'Account' } },
                { path: 'pedido/:id', component: MyOrderPanelComponent, data: { name: 'Account' } },
                { path: 'pedidos/:id', component: MyOrderPanelComponent, data: { name: 'Account' } },
                { path: 'pedidos', component: OrderPanelComponent, data: { name: 'Account' } },
                { path: 'vounchers', component: VouncherPanelComponent, data: { name: 'Account' } },
              ]
            }
          ]),
        CommonModule,
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