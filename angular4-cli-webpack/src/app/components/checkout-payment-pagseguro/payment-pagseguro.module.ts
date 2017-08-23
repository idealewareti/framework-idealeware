import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PaymentPagseguroComponent } from './payment-pagseguro.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CurrencyFormatModule } from "app/pipes/currency-format/currency-format.module";
import { CreditCartdMaskModule } from "app/directives/creditcart-mask/creditcard-mask.module";
import { OfflinePaymentPanelModule } from "../checkout-payment-offline/payment-offline-panel.module";
import { OfflinePaymentModule } from "../checkout-payment-offline/payment-offline.module";
import { WaitLoaderModule } from "app/components/wait-loader/wait-loader.module";
import { CpfMaskModule } from "app/directives/cpf-mask/cpf-mask.module";
import { PhoneMaskModule } from "app/directives/phone-mask/phone-mask.module";

@NgModule({
    declarations: [ PaymentPagseguroComponent ],
    imports: [ 
        BrowserModule, 
        FormsModule, 
        ReactiveFormsModule, 
        CurrencyFormatModule, 
        CreditCartdMaskModule,
        WaitLoaderModule,
        CpfMaskModule,
        PhoneMaskModule
    ],
    providers: [],
    exports: [ PaymentPagseguroComponent ]
})
export class PaymentPagseguroModule {}