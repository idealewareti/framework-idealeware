import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PaymentMundipaggComponent } from './payment-mundipagg.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CurrencyFormatModule } from "app/pipes/currency-format/currency-format.module";
import { OfflinePaymentModule } from "../checkout-payment-offline/payment-offline.module";
import { OfflinePaymentPanelModule } from "../checkout-payment-offline/payment-offline-panel.module";
import { CreditCartdMaskModule } from "app/directives/creditCart-mask/creditCard-mask.module";

@NgModule({
    declarations: [ PaymentMundipaggComponent ],
    imports: [ 
        BrowserModule, 
        FormsModule, 
        ReactiveFormsModule, 
        CurrencyFormatModule,
        OfflinePaymentModule,
        OfflinePaymentPanelModule,
        CreditCartdMaskModule,
    ],
    providers: [],
    exports: [ PaymentMundipaggComponent ]
})
export class PaymentMundipaggModule {}