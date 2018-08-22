import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { CheckoutComponent } from "./checkout/checkout.component";
import { BudgetModule } from "./budget/budget.module";
import { BudgetFinishModule } from "./budget-finish/budget-finish.module";
import { CheckoutAddressesModule } from "./checkout-addresses/checkout-addresses.module";
import { CheckoutCreditCardFormModule } from "./checkout-creditcard-form/checkout-creditcard-form.module";
import { CheckoutFinishModule } from "./checkout-finish/checkout-finish.module";
import { CheckoutPaymentsModule } from "./checkout-payments/checkout-payments.module";
import { CheckoutShippingModule } from "./checkout-shipping/checkout-shipping.module";
import { CurrencyFormatModule } from "../../pipes/currency-format/currency-format.module";
import { CheckoutRoutingModule } from "./checkout.routing.module";
import { WaitLoaderModule } from "../shared/wait-loader/wait-loader.module";

@NgModule({
    declarations: [
        CheckoutComponent
    ],
    imports: [
        CheckoutRoutingModule,
        CommonModule,
        FormsModule,
        BudgetModule,
        BudgetFinishModule,
        CheckoutAddressesModule,
        CheckoutCreditCardFormModule,
        CheckoutFinishModule,
        CheckoutPaymentsModule,
        CheckoutShippingModule,
        WaitLoaderModule,
        CurrencyFormatModule
    ]
})
export class CheckoutModule { }