import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
registerLocaleData(ptBr)
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeoutWith';
import { AppComponent } from './app.component';
import { ShowcaseComponent } from './components/home/showcase/showcase.component';
import { BrandNavModule } from './components/home/brand-nav/brand-nav.module';
import { CategoryMenuModule } from './components/home/category-menu/category-menu.module';
import { GroupModule } from './components/home/group/group.module';
import { MiniCartModule } from './components/home/mini-cart/mini-cart.module';
import { ShowcaseBannerModule } from './components/home/showcase-banner/showcase-banner.module';
import { ShowcaseBannerHalfModule } from './components/home/showcase-banner-half/showcase-banner-half.module';
import { ShowcaseBannerStripeModule } from './components/home/showcase-banner-stripe/showcase-banner-stripe.module';
import { ShowcaseGroupModule } from './components/home/showcase-group/showcase-group.module';
import { CheckoutButtonModule } from './components/shared/checkout-button/checkout-button.module';
import { CurrencyFormatModule } from './pipes/currency-format/currency-format.module';
import { ProductGridItemModule } from './components/shared/product-grid-item/product-grid-item.module';
import { Globals } from './models/globals';
import { StoreService } from './services/store.service';
import { ShowCaseService } from './services/showcase.service';
import { CategoryService } from './services/category.service';
import { GroupService } from './services/group.service';
import { InstitutionalService } from './services/institutional.service';
import { CartService } from './services/cart.service';
import { BrandService } from './services/brand.service';
import { ProductService } from './services/product.service';
import { PaymentManager } from './managers/payment.manager';
import { PaymentService } from './services/payment.service';
import { CartShowcaseService } from './services/cart-showcase.service';
import { SearchPaginationModule } from './components/search/search-pagination/search-pagination.module';
import { SearchComponent } from './components/search/search/search.component';
import { BannerService } from './services/banner.service';
import { BannerModule } from './components/search/banner/banner.module';
import { BannerSideModule } from './components/search/banner-side/banner-side.module';
import { BreadcrumpModule } from './components/shared/breadcrump/breadcrump.module';
import { SearchService } from './services/search.service';
import { ContactService } from './services/contact.service';
import { CartComponent } from './components/cart/cart/cart.component';
import { InstitutionalComponent } from './components/institutional/institutional/institutional.component';
import { ContactModule } from './components/institutional/contact/contact.module';
import { CartShowCaseModule } from './components/cart/cart-showcase/cart-showcase.module';
import { CartManager } from './managers/cart.manager';
import { NewsLetterModule } from './components/home/newsletter/newsletter.module';
import { PopUpModule } from './components/home/pop-up/popup.module';
import { NewsLetterService } from './services/newsletter.service';
import { PopUpService } from './services/pop-up.service';
import { Redirect301Service } from './services/redirect301.service';
import { ShippingCalcModule } from './components/cart/shipping/shipping.module';
import { CouponModule } from './components/cart/coupon/coupon.module';
import { WaitLoaderModule } from './components/shared/wait-loader/wait-loader.module';
import { Error500Component } from './components/error/500/500.component';
import { NotFoundComponent } from './components/error/404/404.component';
import { CompareComponent } from './components/search/compare/compare.component';
import { LoginComponent } from './components/register/login/login.component';
import { SignUpComponent } from './components/register/signup/signup.component';
import { LogoutComponent } from './components/register/logout/logout.component';
import { ProductComponent } from './components/product/product/product.component';
import { RedirectComponent } from './components/home/redirect/redirect.component';
import { ProductGalleryModule } from './components/product/product-gallery/product-gallery.module';
import { ProductCrossSellingModule } from './components/product/product-cross-selling/product-cross-selling.module';
import { ProductUpSellingModule } from './components/product/product-upselling/product-upselling.module';
import { InstallmentSimulationModule } from './components/product/installment-simulation/installment-simulation.module';
import { RelatedProductsModule } from './components/product/product-related/related-product.module';
import { ProductVariationModule } from './components/product/product-variation/product-vatiation.module';
import { ServiceModule } from './components/product/service/service.module';
import { SelfColorModule } from './components/product/self-color/self-color.module';
import { ProductRatingModule } from './components/product/product-rating/product-rating.module';
import { ProductAwaitedService } from './services/product-awaited.service';
import { RelatedProductsService } from './services/related-products.service';
import { ProductRatingService } from './services/product-rating.service';
import { CustomerService } from './services/customer.service';
import { CustomerManager } from './managers/customer.manager';
import { ProductManager } from './managers/product.manager';
import { CouponService } from './services/coupon.service';
import { IntelipostService } from './services/intelipost.service';
import { CheckoutComponent } from './components/checkout/checkout/checkout.component';
import { CheckoutFinishComponent } from './components/checkout/checkout-finish/checkout-finish.component';
import { ForgetPasswordComponent } from './components/register/forget-password/forget-password.component';
import { BudgetComponent } from './components/checkout/budget/budget.component';
import { BudgetFinishComponent } from './components/checkout/budget-finish/budget-finish.component';
import { CheckoutAddressesModule } from './components/checkout/checkout-addresses/checkout-addresses.module';
import { CheckoutCreditCardFormModule } from './components/checkout/checkout-creditcard-form/checkout-creditcard-form.module';
import { CheckoutPaymentsModule } from './components/checkout/checkout-payments/checkout-payments.module';
import { CheckoutShippingModule } from './components/checkout/checkout-shipping/checkout-shipping.module';
import { ServiceService } from './services/service.service';
import { BranchService } from './services/branch.service';
import { OrderService } from './services/order.service';
import { BudgetService } from './services/budget.service';
import { DneAddressService } from './services/dneaddress.service';
import { FipeService } from './services/fipe.service';
import { FormHelper } from './helpers/formhelper';
import { GoogleService } from './services/google.service';
import { SelfColorService } from './services/self-color.service';
import { CpfMaskModule } from './directives/cpf-mask/cpf-mask.module';
import { CnpjMaskModule } from './directives/cnpj-mask/cnpj-mask.module';
import { CreditCartdMaskModule } from './directives/creditcart-mask/creditcard-mask.module';
import { EmailValidatorModule } from './directives/email-validator/email-validator.module';
import { EqualsModule } from './directives/equals/equals.module';
import { PhoneMaskModule } from './directives/phone-mask/phone-mask.module';
import { StrongPasswordModule } from './directives/strong-password/strong-password.module';
import { ZipCodeMaskModule } from './directives/zipcode-mask/zipcode-mask.module';
import { CustomPaintFilterModule } from './pipes/custom-paint-filter/custom-paint-filter.module';
import { OrderByModule } from './pipes/orderBy/orderBy.module';
import { AppConfig } from './app.config';
import { PopUpNewsLetterModule } from './components/home/popup-newsletter/popup-newsletter.module';
import { StoreManager } from './managers/store.manager';

@NgModule({
  declarations: [
    AppComponent,
    BudgetComponent,
    BudgetFinishComponent,
    CartComponent,
    CheckoutComponent,
    CheckoutFinishComponent,
    CompareComponent,
    Error500Component,
    ForgetPasswordComponent,
    InstitutionalComponent,
    LoginComponent,
    LogoutComponent,
    NotFoundComponent,
    ProductComponent,
    RedirectComponent,
    ShowcaseComponent,
    SearchComponent,
    SignUpComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: `${AppConfig.DOMAIN}-app` }),
    RouterModule.forRoot([
      { path: '', component: ShowcaseComponent },
      { path: '404', component: NotFoundComponent },
      { path: 'erro-500', component: Error500Component },
      { path: 'buscar', component: SearchComponent },
      { path: 'carrinho', component: CartComponent },
      { path: 'categoria/:id', component: SearchComponent },
      { path: 'categoria/:id/:nicename', component: SearchComponent },
      { path: 'contato', component: InstitutionalComponent },
      { path: 'conta', loadChildren: 'app/components/account/account.module#AccountModule' },
      { path: 'grupo/:id/:nicename', component: SearchComponent },
      { path: 'checkout', component: CheckoutComponent, data: { name: 'Checkout' } },
      { path: 'checkout/concluido/:id', component: CheckoutFinishComponent },
      { path: 'compare', component: CompareComponent },
      { path: 'corespersonalizadas', loadChildren: 'app/components/custom-paint/custom-paint.module#CustomPaintModule' },
      { path: 'cores-personalizadas', loadChildren: 'app/components/custom-paint/custom-paint.module#CustomPaintModule' },
      { path: 'grupo/:id/:nicename', component: SearchComponent },
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
      { path: ':product', component: ProductComponent },
      { path: '**', component: RedirectComponent }
    ], { initialNavigation: 'enabled' }),
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BannerModule,
    BannerSideModule,
    BreadcrumpModule,
    CartShowCaseModule,
    ContactModule,
    CouponModule,
    CheckoutAddressesModule,
    CheckoutCreditCardFormModule,
    CheckoutPaymentsModule,
    CheckoutShippingModule,
    BrandNavModule,
    CategoryMenuModule,
    CheckoutButtonModule,
    CurrencyFormatModule,
    GroupModule,
    InstallmentSimulationModule,
    MiniCartModule,
    NewsLetterModule,
    PopUpNewsLetterModule,
    PopUpModule,
    ProductCrossSellingModule,
    ProductGalleryModule,
    ProductGridItemModule,
    ProductRatingModule,
    ProductUpSellingModule,
    ProductVariationModule,
    RelatedProductsModule,
    SearchPaginationModule,
    SelfColorModule,
    ServiceModule,
    ShowcaseBannerModule,
    ShowcaseBannerHalfModule,
    ShowcaseBannerStripeModule,
    ShowcaseGroupModule,
    ShippingCalcModule,
    WaitLoaderModule,
    CpfMaskModule,
    CnpjMaskModule,
    CreditCartdMaskModule,
    EmailValidatorModule,
    EqualsModule,
    PhoneMaskModule,
    StrongPasswordModule,
    ZipCodeMaskModule,
    CurrencyFormatModule,
    CustomPaintFilterModule,
    OrderByModule,
    BrowserTransferStateModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    Globals,
    BannerService,
    BranchService,
    BrandService,
    BudgetService,
    CartService,
    CartShowcaseService,
    CategoryService,
    ContactService,
    CouponService,
    CustomerService,
    DneAddressService,
    FipeService,
    FormHelper,
    GoogleService,
    GroupService,
    InstitutionalService,
    IntelipostService,
    NewsLetterService,
    OrderService,
    PaymentService,
    PopUpService,
    ProductService,
    ProductAwaitedService,
    ProductRatingService,
    RelatedProductsService,
    Redirect301Service,
    SearchService,
    SelfColorService,
    ServiceService,
    ShowCaseService,
    StoreService,
    CartManager,
    CustomerManager,
    PaymentManager,
    ProductManager,
    StoreManager
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
