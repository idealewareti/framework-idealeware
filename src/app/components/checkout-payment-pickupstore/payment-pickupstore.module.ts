import { NgModule } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { PaymentPickuUpStoreComponent } from "app/components/checkout-payment-pickupstore/payment-pickupstore.component";

@NgModule({
    declarations: [ PaymentPickuUpStoreComponent ],
    imports: [ BrowserModule ],
    exports: [ PaymentPickuUpStoreComponent ],
})
export class PaymentPickuUpStoreModule {}