import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutButtonComponent } from './checkout-button.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [ CheckoutButtonComponent ],
    imports: [ CommonModule, RouterModule, FormsModule ],
    exports: [ CheckoutButtonComponent ],
    providers: [],
})
export class CheckoutButtonModule {}