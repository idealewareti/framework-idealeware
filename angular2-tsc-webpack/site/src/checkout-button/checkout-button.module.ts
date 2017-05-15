import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CheckoutButtonComponent} from './checkout-button.component';

@NgModule({
    imports: [BrowserModule, RouterModule, FormsModule],
    declarations: [CheckoutButtonComponent],
    exports: [CheckoutButtonComponent]
})
export class CheckoutButtonModule {}