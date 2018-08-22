import { NgModule } from '@angular/core';
import { CouponComponent } from './coupon.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CurrencyFormatModule } from '../../../pipes/currency-format/currency-format.module';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [CouponComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CurrencyFormatModule
    ],
    providers: [],
    exports: [CouponComponent]
})
export class CouponModule { }