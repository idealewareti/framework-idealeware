import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PaymentPagseguroComponent } from './payment-pagseguro.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CurrencyFormatModule } from "app/pipes/currency-format/currency-format.module";
import { CreditCartdMaskModule } from "app/directives/creditcart-mask/creditcard-mask.module";
import { OfflinePaymentPanelModule } from "../checkout-payment-offline/payment-offline-panel.module";
import { OfflinePaymentModule } from "../checkout-payment-offline/payment-offline.module";

@NgModule({
    declarations: [ PaymentPagseguroComponent ],
    imports: [ 
        BrowserModule, 
        FormsModule, 
        ReactiveFormsModule, 
        CurrencyFormatModule, 
        CreditCartdMaskModule,
        OfflinePaymentModule,
        OfflinePaymentPanelModule,
    ],
    providers: [],
    exports: [ PaymentPagseguroComponent ]
})
export class PaymentPagseguroModule {}