import { NgModule } from "../../../../../node_modules/@angular/core";
import { CommonModule } from "../../../../../node_modules/@angular/common";
import { RouterModule } from "../../../../../node_modules/@angular/router";

import { CheckoutFinishComponent } from "./checkout-finish.component";

@NgModule({
    declarations: [CheckoutFinishComponent],
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [CheckoutFinishComponent]
})
export class CheckoutFinishModule { }