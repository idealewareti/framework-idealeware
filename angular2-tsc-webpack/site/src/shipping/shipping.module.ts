import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ShippingCalcComponent } from './shipping.component';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ZipCodeMaskModule } from "../_directives/zipcode-mask/zipcode-mask.module";
import { CurrencyFormatModule } from "../_pipes/currency-format.module";

@NgModule({
    declarations: [ ShippingCalcComponent ],
    imports: [ BrowserModule, RouterModule, FormsModule, ReactiveFormsModule, ZipCodeMaskModule, CurrencyFormatModule ],
    providers: [],
    exports: [ ShippingCalcComponent ]
})
export class ShippingCalcModule {}