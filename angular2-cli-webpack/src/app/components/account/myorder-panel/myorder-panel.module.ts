import { NgModule } from '@angular/core';
import { MyOrderPanelComponent } from './myorder-panel.component';
import { CurrencyFormatModule } from "app/pipes/currency-format/currency-format.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [ MyOrderPanelComponent ],
    imports: [ CommonModule, CurrencyFormatModule ],
    providers: [],
    exports: [ MyOrderPanelComponent ]
})
export class MyOrderPanelModule {}