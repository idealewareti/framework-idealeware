import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MiniCartComponent} from './mini-cart.component';
import {RouterModule} from '@angular/router';
import {CurrencyFormatModule} from 'app/pipes/currency-format/currency-format.module';
import {FormsModule} from '@angular/forms';
import {CheckoutButtonModule} from '../checkout-button/checkout-button.module';

@NgModule({
    imports: [BrowserModule, RouterModule, FormsModule, CheckoutButtonModule, CurrencyFormatModule],
    declarations: [MiniCartComponent],
    exports: [MiniCartComponent]
})
export class MiniCartModule {}