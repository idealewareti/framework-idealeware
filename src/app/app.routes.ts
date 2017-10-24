import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { BudgetComponent } from "./components/budget/budget.component";
import { BudgetFinishComponent } from "./components/budget-finish/budget-finish.component";
import { CartComponent } from  './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CheckoutFinishComponent } from "./components/checkout-finish/checkout-finish.component";
import { CompareComponent } from "./components/compare/compare.component";
import { ForgetPasswordComponent } from "./components/forget-password/forget-password.component";
import { InstitutionalComponent } from './components/institutional/institutional.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { NotFoundComponent } from "./components/404/404.component";
import { ProductComponent } from './components/product/product.component';
import { SearchComponent } from './components/search/search.component';
import { ShowCaseComponent } from './components/showcase/showcase.component';
import { SignUpComponent } from "app/components/signup/signup.component";
import { RedirectComponent } from "app/components/redirect/redirect.component";
import { Error500Component } from 'app/components/500/500.component';

const appRoutes: Routes = [
    { path: '', component: ShowCaseComponent },
    { path: '404', component: NotFoundComponent },
    { path: 'erro-500', component: Error500Component },
    { path: 'buscar', component: SearchComponent },
    { path: 'carrinho', component: CartComponent },
    { path: 'categoria/:id', component: SearchComponent },
    { path: 'categoria/:id/:nicename', component: SearchComponent },
    { path: 'contato', component: InstitutionalComponent },
    { path: 'conta', loadChildren: 'app/components/account/account.module#AccountModule' },
    { path: 'grupo/:id/:nicename', component: SearchComponent    },
    { path: 'checkout', component: CheckoutComponent, data: { name: 'Checkout'} },
    { path: 'checkout/concluido/:id', component: CheckoutFinishComponent },
    { path: 'compare', component: CompareComponent },
    { path: 'corespersonalizadas', loadChildren: 'app/components/custom-paint/custom-paint.module#CustomPaintModule' },
    { path: 'cores-personalizadas', loadChildren: 'app/components/custom-paint/custom-paint.module#CustomPaintModule' },
    { path: 'grupo/:id/:nicename', component: SearchComponent    },
    { path: 'buscar', component: SearchComponent },
    { path: 'institucional/:id', component: InstitutionalComponent },
    { path: 'institucional/:id/:nicename', component: InstitutionalComponent },
    { path: 'login', component: LoginComponent },
    { path: 'login/:step', component: LoginComponent },
    { path: 'cadastrar', component: SignUpComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'marcas/:id', component: SearchComponent },
    { path: 'marcas/:id/:nicename', component: SearchComponent },
    { path: 'orcamento', component: BudgetComponent },
    { path: 'orcamento/concluido', component: BudgetFinishComponent },
    { path: 'orcamento/concluido/:id', component: BudgetFinishComponent },
    { path: 'produto/:id', component: ProductComponent },
    { path: 'recuperar-senha', component: ForgetPasswordComponent },
    { path: 'recuperar-senha', component: ForgetPasswordComponent },
    { path: ':product', component: ProductComponent },
    { path: '**', component: RedirectComponent }
      
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: false });

