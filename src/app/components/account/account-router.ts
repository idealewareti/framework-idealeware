import { NgModule }     from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';
import { AccountHomeComponent } from './home/home-panel.component';
import { UserEditComponent } from './user-edit-panel/user-edit.component';
import { AddressPanelComponent } from './address-panel/address-panel.component';
import { MyOrderPanelComponent } from './myorder-panel/myorder-panel.component';
import { AddressEditComponent } from './address-edit-panel/address-edit.component';
import { OrderPanelComponent } from './orders-panel/orders-panel.component';
import { VouncherPanelComponent } from './vouncher-panel/vouncher-panel.component';



const routes: Routes = [
  { path: '',
    component: AccountComponent,
    children: [
      { path: '',    component: AccountHomeComponent, data: { name: 'Account' } },
      { path: 'home', component: AccountHomeComponent, data: { name: 'Account' } },
      { path: 'dados-cadastrais', component: UserEditComponent, data: { name: 'Account' } },
      { path: 'enderecos', component: AddressPanelComponent, data: { name: 'Account' } },
      { path: 'enderecos/:id', component: AddressEditComponent, data: { name: 'Account' } },
      { path: 'pedido/:id', component:  MyOrderPanelComponent, data: { name: 'Account' } },
      { path: 'pedidos/:id', component:  MyOrderPanelComponent, data: { name: 'Account' } },
      { path: 'pedidos', component:  OrderPanelComponent, data: { name: 'Account' } },
      { path: 'vounchers', component: VouncherPanelComponent, data: { name: 'Account' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}