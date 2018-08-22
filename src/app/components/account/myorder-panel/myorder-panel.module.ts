import { NgModule } from '@angular/core';
import { MyOrderPanelComponent } from './myorder-panel.component';
import { CurrencyFormatModule } from "../../../pipes/currency-format/currency-format.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [ MyOrderPanelComponent ],
    imports: [ CommonModule, CurrencyFormatModule ],
    exports: [ MyOrderPanelComponent ]
})
export class MyOrderPanelModule {}