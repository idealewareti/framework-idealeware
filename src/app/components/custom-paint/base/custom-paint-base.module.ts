import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CustomPaintBaseComponent }  from './custom-paint-base.component';
import { RouterModule } from "@angular/router";
import { CurrencyFormatModule } from "app/pipes/currency-format/currency-format.module";

@NgModule({
    declarations: [ CustomPaintBaseComponent ],
    imports: [ CommonModule, RouterModule, CurrencyFormatModule ],
    providers: [],
    exports: [ CustomPaintBaseComponent ]
})
export class CustomPaintBaseModule {}