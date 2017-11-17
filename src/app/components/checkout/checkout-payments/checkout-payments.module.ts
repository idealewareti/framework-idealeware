import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutPaymentsComponent } from './checkout-payments.component';
import { CurrencyFormatModule } from '../../../pipes/currency-format/currency-format.module';
import { WaitLoaderModule } from '../../shared/wait-loader/wait-loader.module';
import { CheckoutCreditCardFormModule } from '../checkout-creditcard-form/checkout-creditcard-form.module';

@NgModule({
    declarations: [ CheckoutPaymentsComponent ],
    imports: [ CommonModule, CurrencyFormatModule, WaitLoaderModule, CheckoutCreditCardFormModule ],
    exports: [ CheckoutPaymentsComponent ],
    providers: [],
})
export class CheckoutPaymentsModule {}