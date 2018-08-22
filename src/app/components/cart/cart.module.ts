import { NgModule } from "@angular/core";
import { CartComponent } from "./cart/cart.component";
import { CommonModule } from "@angular/common";
import { CartShowCaseModule } from "./cart-showcase/cart-showcase.module";
import { CouponModule } from "./coupon/coupon.module";
import { ShippingCalcModule } from "./shipping/shipping.module";
import { CheckoutButtonModule } from "../shared/checkout-button/checkout-button.module";
import { CurrencyFormatModule } from "../../pipes/currency-format/currency-format.module";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CartResolver } from "../../resolvers/cart.resolver";

@NgModule({
    declarations: [
        CartComponent
    ],
    imports: [
        RouterModule.forChild([
            { path: '', component: CartComponent, resolve: { cart: CartResolver } }
        ]),
        CommonModule,
        FormsModule,
        CartShowCaseModule,
        CouponModule,
        ShippingCalcModule,
        CheckoutButtonModule,
        CurrencyFormatModule
    ]
})
export class CartModule { }