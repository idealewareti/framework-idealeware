import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MiniCartComponent } from './mini-cart.component';
import { CurrencyFormatModule } from '../../../pipes/currency-format/currency-format.module';
import { CheckoutButtonModule } from '../../shared/checkout-button/checkout-button.module';
import { WaitLoaderModule } from '../../shared/wait-loader/wait-loader.module';

@NgModule({
    declarations: [MiniCartComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        CurrencyFormatModule,
        CheckoutButtonModule, 
        WaitLoaderModule
    ],
    exports: [MiniCartComponent],
})
export class MiniCartModule { }