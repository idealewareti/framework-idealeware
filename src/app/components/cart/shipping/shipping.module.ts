import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ShippingCalcComponent } from './shipping.component';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ZipCodeMaskModule } from '../../../directives/zipcode-mask/zipcode-mask.module';
import { CurrencyFormatModule } from '../../../pipes/currency-format/currency-format.module';
import { WaitLoaderModule } from '../../shared/wait-loader/wait-loader.module';

@NgModule({
    declarations: [ ShippingCalcComponent ],
    imports: [ BrowserModule, RouterModule, FormsModule, ReactiveFormsModule, ZipCodeMaskModule, CurrencyFormatModule, WaitLoaderModule ],
    providers: [],
    exports: [ ShippingCalcComponent ]
})
export class ShippingCalcModule {}