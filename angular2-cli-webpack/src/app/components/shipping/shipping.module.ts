import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ShippingCalcComponent } from './shipping.component';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ZipCodeMaskModule } from "app/directives/zipcode-mask/zipcode-mask.module";
import { CurrencyFormatModule } from "app/pipes/currency-format.module";

@NgModule({
    declarations: [ ShippingCalcComponent ],
    imports: [ BrowserModule, RouterModule, FormsModule, ReactiveFormsModule, ZipCodeMaskModule, CurrencyFormatModule ],
    providers: [],
    exports: [ ShippingCalcComponent ]
})
export class ShippingCalcModule {}