import { NgModule } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { MundipaggBankslipComponent } from "app/components/checkout-payment-mundipagg/mundipagg-bankslip/mundipagg-bankslip.component";

@NgModule({
    declarations: [ MundipaggBankslipComponent ],
    imports: [ BrowserModule ],
    exports: [ MundipaggBankslipComponent ],
    providers: [],
})
export class MundiPaggBankslipModule {}