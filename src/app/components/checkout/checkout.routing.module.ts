import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CheckoutComponent } from "./checkout/checkout.component";
import { StoreResolver } from "../../resolvers/store.resolver";
import { CartResolver } from "../../resolvers/cart.resolver";
import { PaymentResolver } from "../../resolvers/payment.resolver";
import { CustomerResolver } from "../../resolvers/customer.resolver";
import { CheckoutFinishComponent } from "./checkout-finish/checkout-finish.component";
import { OrderResolver } from "../../resolvers/order.resolver";
import { BudgetComponent } from "./budget/budget.component";
import { BudgetFinishComponent } from "./budget-finish/budget-finish.component";
import { AuthGuard } from "../../guards/auth.guard";
import { CheckoutGuard } from "../../guards/checkout.guard";

const routes: Routes = [
    {
        path: '', component: CheckoutComponent, resolve:
        {
            store: StoreResolver,
            cart: CartResolver,
            payments: PaymentResolver,
            customer: CustomerResolver
        },
        canActivate: [AuthGuard],
        canDeactivate: [CheckoutGuard]
    },
    {
        path: 'concluido/:id', component: CheckoutFinishComponent, resolve:
        {
            order: OrderResolver
        }
    },
    {
        path: 'orcamento', component: BudgetComponent, resolve:
        {
            store: StoreResolver,
            customer: CustomerResolver,
            cart: CartResolver
        }
    },
    {
        path: 'orcamento/concluido/:id', component: BudgetFinishComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class CheckoutRoutingModule { }