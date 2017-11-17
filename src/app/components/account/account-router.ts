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