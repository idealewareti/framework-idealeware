import { NgModule } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MundipaggCreditCardComponent } from "app/components/checkout-payment-mundipagg/mundipagg-creditcard/mundipagg-creditcard.component";
import { CreditCartdMaskModule } from "app/directives/creditcart-mask/creditcard-mask.module";
import { CurrencyFormatModule } from "app/pipes/currency-format/currency-format.module";

@NgModule({
    declarations: [ MundipaggCreditCardComponent ],
    imports: [ 
        BrowserModule,
        FormsModule, 
        CreditCartdMaskModule, 
        CurrencyFormatModule,
        ReactiveFormsModule, 
    ],
    exports: [ MundipaggCreditCardComponent ],
    providers: [],
})
export class MundipaggCreditCardModule {}