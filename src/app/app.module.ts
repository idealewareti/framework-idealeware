import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
registerLocaleData(ptBr)
import 'rxjs/add/operator/map';


import { AppComponent } from './app.component';

/* Home */
import { ShowcaseComponent } from './components/home/showcase/showcase.component';
import { BrandNavModule } from './components/home/brand-nav/brand-nav.module';
import { CategoryMenuModule } from './components/home/category-menu/category-menu.module';
import { GroupModule } from './components/home/group/group.module';
import { MiniCartModule } from './components/home/mini-cart/mini-cart.module';
import { ShowcaseBannerModule } from './components/home/showcase-banner/showcase-banner.module';
import { ShowcaseBannerHalfModule } from './components/home/showcase-banner-half/showcase-banner-half.module';
import { ShowcaseBannerStripeModule } from './components/home/showcase-banner-stripe/showcase-banner-stripe.module';
/* Search */
/* Product */
/* Cart */
/* Checkout */
/* Custom Paint */
/* Account */
/* Shared */
import { CheckoutButtonModule } from './components/shared/checkout-button/checkout-button.module';
import { CurrencyFormatModule } from './pipes/currency-format/currency-format.module';
import { ProductGridItemModule } from './components/shared/product-grid-item/product-grid-item.module';

/* Services */
import { StoreService } from './services/store.service';
import { Globals } from './models/globals';
import { ShowCaseService } from './services/showcase.service';
import { CategoryService } from './services/category.service';
import { GroupService } from './services/group.service';
import { InstitutionalService } from './services/institutional.service';
import { CartService } from './services/cart.service';
import { BrandService } from './services/brand.service';
import { ShowcaseGroupModule } from './components/home/showcase-group/showcase-group.module';
import { ProductService } from './services/product.service';
import { PaymentManager } from './managers/payment.manager';
import { PaymentService } from './services/payment.service';


@NgModule({
  declarations: [
    AppComponent,
    ShowcaseComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'idealecommerce-app'}),
    RouterModule.forRoot([
      { path: '', component: ShowcaseComponent, pathMatch: 'full'},
    ]),
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrandNavModule,
    CategoryMenuModule,
    CheckoutButtonModule,
    CurrencyFormatModule,
    GroupModule,
    MiniCartModule,
    ProductGridItemModule,
    ShowcaseBannerModule,
    ShowcaseBannerHalfModule,
    ShowcaseBannerStripeModule,
    ShowcaseGroupModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    Globals,
    BrandService,
    CartService,
    CategoryService,
    GroupService,
    InstitutionalService,
    PaymentManager,
    PaymentService,
    ProductService,
    ShowCaseService,
    StoreService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
