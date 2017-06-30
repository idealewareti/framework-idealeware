import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderPanelComponent }  from './orders-panel.component';
import { CurrencyFormatModule } from "app/pipes/currency-format/currency-format.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [ OrderPanelComponent ],
    imports: [ CommonModule, RouterModule, CurrencyFormatModule ],
    exports: [ OrderPanelComponent ]
})
export class OrderPanelModule {}