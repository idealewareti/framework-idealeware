import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutAddressesComponent } from 'app/components/checkout-addresses/checkout-addresses.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [ CheckoutAddressesComponent ],
    imports: [ CommonModule, RouterModule ],
    exports: [ CheckoutAddressesComponent ],
    providers: [],
})
export class CheckoutAddressesModule {}