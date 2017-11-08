import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CurrencyFormatModule } from './pipes/currency-format/currency-format.module';
import { CheckoutButtonModule } from './components/shared/checkout-button/checkout-button.module';

/* Services */
import { HttpClientHelper } from './helpers/http.helper';
import { StoreService } from './services/store.service';
import { Globals } from './models/globals';
import { ShowCaseService } from './services/showcase.service';
import { CategoryService } from './services/category.service';
import { GroupService } from './services/group.service';
import { InstitutionalService } from './services/institutional.service';
import { CartService } from './services/cart.service';
import { BrandService } from './services/brand.service';


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
    ShowcaseBannerModule,
    ShowcaseBannerHalfModule,
    ShowcaseBannerStripeModule,
  ],
  providers: [
    HttpClientHelper,
    Globals,
    BrandService,
    CartService,
    CategoryService,
    GroupService,
    InstitutionalService,
    ShowCaseService,
    StoreService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
