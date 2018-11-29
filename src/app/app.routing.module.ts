import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
    { path: '', loadChildren: './components/home/showcase/showcase.module#ShowcaseModule' },

    { path: 'buscar', loadChildren: './components/search/search.module#SearchModule' },
    { path: 'compare', loadChildren: './components/search/compare.module#CompareModule' },
    { path: 'categoria/:id', loadChildren: './components/search/search.module#SearchModule' },
    { path: 'grupo/:id', loadChildren: './components/search/search.module#SearchModule' },
    { path: 'marcas/:id', loadChildren: './components/search/search.module#SearchModule' },

    { path: 'conta', loadChildren: 'app/components/account/account.module#AccountModule' },

    { path: 'contato', loadChildren: './components/institutional/institutional.module#InstitutionalModule' },
    { path: 'institucional/:id', loadChildren: './components/institutional/institutional.module#InstitutionalModule' },

    { path: 'login', loadChildren: './components/register/login/login.module#LoginModule' },
    { path: 'login/:step', loadChildren: './components/register/login/login.module#LoginModule' },
    { path: 'cadastrar', loadChildren: './components/register/signup/signup.module#SignUpModule' },
    { path: 'recuperar-senha', loadChildren: './components/register/forgot-password/forgot-password.module#ForgotPasswordModule' },

    { path: 'carrinho', loadChildren: './components/cart/cart.module#CartModule' },
    { path: 'carrinho/:id', loadChildren: './components/cart/cart.module#CartModule' },

    { path: 'checkout', loadChildren: './components/checkout/checkout.module#CheckoutModule' },

    { path: 'not-found', loadChildren: './components/not-found/not-found.module#NotFoundModule' },
    { path: 'internal-server-error', loadChildren: './components/internal-server-error/internal-server-error.module#InternalServerErrorModule' },

    { path: ':produto_id', loadChildren: './components/product/product.module#ProductModule' },

    { path: '**', loadChildren: './components/not-found/not-found.module#NotFoundModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes,
        {
            preloadingStrategy: PreloadAllModules,
            initialNavigation: true
        })],
    exports: [RouterModule]
})
export class AppRoutingModule { }