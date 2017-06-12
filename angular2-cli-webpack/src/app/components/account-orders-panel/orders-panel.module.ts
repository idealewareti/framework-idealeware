import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { OrderPanelComponent }  from './orders-panel.component';
import { MyOrderPanelModule } from './myorder-panel.module';
import { CurrencyFormatModule } from "app/pipes/currency-format.module";

@NgModule({ 
    declarations: [OrderPanelComponent],
    imports: [BrowserModule, MyOrderPanelModule, RouterModule, CurrencyFormatModule],
    exports: [OrderPanelComponent]
})
export class OrderPanelModule {}