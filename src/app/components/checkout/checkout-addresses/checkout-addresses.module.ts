import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckoutAddressesComponent } from './checkout-addresses.component';

@NgModule({
    declarations: [ CheckoutAddressesComponent ],
    imports: [ CommonModule, RouterModule ],
    exports: [ CheckoutAddressesComponent ]
})
export class CheckoutAddressesModule {}