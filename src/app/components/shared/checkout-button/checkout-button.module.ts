import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { CheckoutButtonComponent } from "./checkout-button.component";

@NgModule({
    declarations: [CheckoutButtonComponent],
    imports: [CommonModule, RouterModule, FormsModule],
    exports: [CheckoutButtonComponent]
})
export class CheckoutButtonModule { }