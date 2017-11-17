import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutCreditCardFormComponent } from './checkout-creditcard-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreditCartdMaskModule } from '../../../directives/creditcart-mask/creditcard-mask.module';
import { CpfMaskModule } from '../../../directives/cpf-mask/cpf-mask.module';
import { CurrencyFormatModule } from '../../../pipes/currency-format/currency-format.module';
import { PhoneMaskModule } from '../../../directives/phone-mask/phone-mask.module';

@NgModule({
    declarations: [ CheckoutCreditCardFormComponent ],
    imports: [ CommonModule, FormsModule, ReactiveFormsModule, CreditCartdMaskModule, CpfMaskModule, PhoneMaskModule, CurrencyFormatModule ],
    exports: [ CheckoutCreditCardFormComponent ],
    providers: [],
})
export class CheckoutCreditCardFormModule {}