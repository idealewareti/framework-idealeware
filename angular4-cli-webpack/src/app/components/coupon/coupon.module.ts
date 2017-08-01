import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CouponComponent } from './coupon.component';
import { CurrencyFormatModule } from "app/pipes/currency-format/currency-format.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [ CouponComponent ],
    imports: [ BrowserModule, CurrencyFormatModule, FormsModule, ReactiveFormsModule ],
    providers: [],
    exports: [ CouponComponent ]
})
export class CouponModule {}