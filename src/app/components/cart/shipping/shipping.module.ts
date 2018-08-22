import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { ShippingCalcComponent } from './shipping.component';
import { ZipCodeMaskModule } from '../../../directives/zipcode-mask/zipcode-mask.module';
import { CurrencyFormatModule } from '../../../pipes/currency-format/currency-format.module';
import { WaitLoaderModule } from '../../shared/wait-loader/wait-loader.module';
import { IntelispostManager } from '../../../managers/intelispost.manager';
import { BranchManager } from '../../../managers/branch.manager';

@NgModule({
    declarations: [ShippingCalcComponent],
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ZipCodeMaskModule, CurrencyFormatModule, WaitLoaderModule],
    providers: [
        IntelispostManager,
        BranchManager
    ],
    exports: [ShippingCalcComponent]
})
export class ShippingCalcModule { }