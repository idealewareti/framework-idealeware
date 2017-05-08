import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { CurrencyFormatPipe } from '../_pipes/currency-format.pipe';

@NgModule({
    declarations: [CheckoutComponent],
    exports: [CheckoutComponent],
    imports: [
        BrowserModule, 
        RouterModule, 
        FormsModule, 
        CurrencyFormatPipe,
    ],
    providers: []
})
export class CheckoutModule {}