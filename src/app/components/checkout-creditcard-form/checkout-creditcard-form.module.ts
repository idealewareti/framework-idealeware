import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutCreditCardFormComponent } from './checkout-creditcard-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreditCartdMaskModule } from 'app/directives/creditcart-mask/creditcard-mask.module';
import { CpfMaskModule } from 'app/directives/cpf-mask/cpf-mask.module';
import { CurrencyFormatModule } from 'app/pipes/currency-format/currency-format.module';
import { PhoneMaskModule } from 'app/directives/phone-mask/phone-mask.module';

@NgModule({
    declarations: [ CheckoutCreditCardFormComponent ],
    imports: [ CommonModule, FormsModule, ReactiveFormsModule, CreditCartdMaskModule, CpfMaskModule, PhoneMaskModule, CurrencyFormatModule ],
    exports: [ CheckoutCreditCardFormComponent ],
    providers: [],
})
export class CheckoutCreditCardFormModule {}