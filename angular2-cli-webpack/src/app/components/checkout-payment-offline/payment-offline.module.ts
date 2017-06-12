import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OfflinePaymentComponent }  from './payment-offline.component';

@NgModule({
    declarations: [ OfflinePaymentComponent ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ OfflinePaymentComponent ]
})
export class OfflinePaymentModule {}