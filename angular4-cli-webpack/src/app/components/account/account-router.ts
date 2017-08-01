import { NgModule }     from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from "app/components/account/account.component";
import { AccountHomeComponent } from "app/components/account/home/home-panel.component";
import { UserEditComponent } from "app/components/account/user-edit-panel/user-edit.component";
import { OrderPanelComponent } from "app/components/account/orders-panel/orders-panel.component";
import { MyOrderPanelComponent } from "app/components/account/myorder-panel/myorder-panel.component";
import { AddressPanelComponent } from "app/components/account/address-panel/address-panel.component";
import { AddressEditComponent } from "app/components/account/address-edit-panel/address-edit.component";
import { VouncherPanelComponent } from "app/components/account/vouncher-panel/vouncher-panel.component";


const routes: Routes = [
  { path: '',
    component: AccountComponent,
    children: [
      { path: '',    component: AccountHomeComponent },
      { path: 'home', component: AccountHomeComponent },
      { path: 'dados-cadastrais', component: UserEditComponent },
      { path: 'enderecos', component: AddressPanelComponent },
      { path: 'enderecos/:id', component: AddressEditComponent },
      { path: 'pedido/:id', component:  MyOrderPanelComponent },
      { path: 'pedidos/:id', component:  MyOrderPanelComponent },
      { path: 'pedidos', component:  OrderPanelComponent },
      { path: 'vounchers', component: VouncherPanelComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}