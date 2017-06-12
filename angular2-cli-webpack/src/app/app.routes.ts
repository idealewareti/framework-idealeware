import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import {ShowCaseComponent} from './components/showcase/showcase.component';
import {ProductComponent} from './components/product/product.component';
import {CartComponent} from  './components/cart/cart.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {LoginComponent} from './components/login/login.component';
import {LogoutComponent} from './components/login/logout.component';
import {AccountComponent} from './components/account/account.component';
import {SearchComponent} from './components/search/search.component';
import { InstitutionalComponent } from './components/institutional/institutional.component';
import { CheckoutFinishComponent } from "./components/checkout-finish/checkout-finish.component";
import { CompareComponent } from "./components/compare/compare.component";
import { BudgetComponent } from "./components/budget/budget.component";
import { BudgetFinishComponent } from "./components/budget-finish/budget-finish.component";
import { NotFoundComponent } from "./components/404/404.component";
import { ForgetPasswordComponent } from "./components/forget-password/forget-password.component";
import { ContactComponent } from "app/components/contact/contact.component";

const appRoutes: Routes = [
    { path: '', component: ShowCaseComponent },
    { path: '404', component: NotFoundComponent },
    { path: 'carrinho', component: CartComponent },
    { path: 'categoria/:id', component: SearchComponent },
    { path: 'categoria/:id/:nicename', component: SearchComponent },
    { path: 'contato', component: ContactComponent },
    { path: 'grupo/:id/:nicename', component: SearchComponent    },
    { path: 'checkout', component: CheckoutComponent, data: { name: 'Checkout'} },
    { path: 'checkout/concluido/:id', component: CheckoutFinishComponent },
    { path: 'compare', component: CompareComponent },
    { path: 'conta', component: AccountComponent },
    { path: 'conta/:step', component: AccountComponent },
    { path: 'conta/:step/:id', component: AccountComponent },
    { path: 'buscar', component: SearchComponent },
    { path: 'institucional/:id', component: InstitutionalComponent },
    { path: 'institucional/:id/:nicename', component: InstitutionalComponent },
    { path: 'login', component: LoginComponent },
    { path: 'login/:step', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'marcas/:id', component: SearchComponent },
    { path: 'marcas/:id/:nicename', component: SearchComponent },
    { path: 'orcamento', component: BudgetComponent },
    { path: 'orcamento/concluido', component: BudgetFinishComponent },
    { path: 'orcamento/concluido/:id', component: BudgetFinishComponent },
    { path: 'produto/:id/:nicename', component: ProductComponent },
    { path: 'produto/:id', component: ProductComponent },
    { path: 'recuperar-senha', component: ForgetPasswordComponent },
    { path: '**', component: ShowCaseComponent }
      
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });

