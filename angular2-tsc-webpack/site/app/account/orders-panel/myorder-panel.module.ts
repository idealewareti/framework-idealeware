import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MyOrderPanelComponent } from './myorder-panel.component';
import { CurrencyFormatModule } from "../../_pipes/currency-format.module";

@NgModule({ 
    declarations: [ MyOrderPanelComponent ],
    imports: [ BrowserModule, CurrencyFormatModule ],
    providers: [],
    exports: [ MyOrderPanelComponent ]
})
export class MyOrderPanelModule {}