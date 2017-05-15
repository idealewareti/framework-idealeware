import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {CartComponent} from './cart.component';
import { CheckoutButtonModule } from '../checkout-button/checkout-button.module'
import { CurrencyFormatPipe } from "../_pipes/currency-format.pipe";

@NgModule({
    declarations: [CartComponent],
    exports: [CartComponent],
    imports: [BrowserModule, CheckoutButtonModule, CurrencyFormatPipe]
})
export class CartModule {}