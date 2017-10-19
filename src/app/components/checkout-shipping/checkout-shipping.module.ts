import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutShippingComponent } from './checkout-shipping.component';
import { CurrencyFormatModule } from 'app/pipes/currency-format/currency-format.module';

@NgModule({
    declarations: [ CheckoutShippingComponent ],
    imports: [ CommonModule, CurrencyFormatModule ],
    exports: [ CheckoutShippingComponent ],
    providers: [],
})
export class CheckoutShippingModule {}