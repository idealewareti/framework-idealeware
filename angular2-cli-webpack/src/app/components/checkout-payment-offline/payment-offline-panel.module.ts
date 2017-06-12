import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OfflinePaymentPanelComponent }  from './payment-offline-panel.component';

@NgModule({
    declarations: [ OfflinePaymentPanelComponent ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ OfflinePaymentPanelComponent ]
})
export class OfflinePaymentPanelModule {}