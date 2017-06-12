/* Base */
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, BrowserXhr} from '@angular/http';
import {RouterModule} from '@angular/router';
import 'rxjs/Rx';

/* Components */
import {AccountComponent} from './components/account/account.component';
import {AppComponent} from './app.component';
import {BudgetComponent} from './components/budget/budget.component';
import {BudgetFinishComponent} from './components/budget-finish/budget-finish.component';
import {CartComponent} from './components/cart/cart.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {CheckoutFinishComponent} from "./components/checkout-finish/checkout-finish.component";
import {CompareComponent} from './components/compare/compare.component';
import {ContactComponent} from './components/contact/contact.component';
import {ForgetPasswordComponent} from './components/forget-password/forget-password.component';
import {InstitutionalComponent} from './components/institutional/institutional.component';
import {LoginComponent} from './components/login/login.component';
import {LogoutComponent} from './components/login/logout.component';
import {NotFoundComponent} from './components/404/404.component';
import {ProductComponent} from './components/product/product.component';
import {SearchComponent} from './components/search/search.component';
import {ShowCaseComponent} from './components/showcase/showcase.component';

/* Modules */
import {AddressPanelListModule} from './components/account-address-panel/address-panel-list.module';
import {AddressPanelModule} from './components/account-address-panel/address-panel.module';
import {BannerModule} from './components/banner/banner.module';
import {BannerSideModule} from './components/banner/banner-side.module';
import {BrandNavModule} from './components/brand-nav/brand-nav.module';
import {BreadcrumpModule} from './components/breadcrump/breadcrump.module';
import {CartShowCaseModule} from './components/cart-showcase/cart-showcase.module';
import {CategoryNavModule} from './components/category-nav/category-nav.module';
import {CouponModule} from './components/coupon/coupon.module';
import {CheckoutButtonModule} from './components/checkout-button/checkout-button.module';
import {GroupModule} from './components/group/group.module';
import {InstallmentSimulationModule} from './components/product-simulation/installment-simulation.module';
import {LoginEmbedModule} from './components/login-embed/login-embed.module';
import {MiniCartModule} from './components/cart-mini/mini-cart.module';
import {MyOrderPanelModule} from './components/account-orders-panel/myorder-panel.module';
import {NewAddressModule} from './components/account-address-panel/address-edit.module';
import {NewsLetterModule} from './components/newsletter/newsletter.module';
import {OrderPanelModule} from './components/account-orders-panel/orders-panel.module';
import {PaymentMundipaggModule} from './components/checkout-payment-mundipagg/payment-mundipagg.module';
import {PaymentPagseguroModule} from './components/checkout-payment-pagseguro/payment-pagseguro.module';
import {PopUpModule} from './components/pop-up/popup.module';
import {ProductCrossSellingModule} from './components/product-cross-selling/product-cross-selling.module';
import {ProductGalleryModule} from './components/product-gallery/product-gallery.module';
import {ProductGridItemModule} from './components/product-grid-item/product-grid-item.module';
import {ProductRatingModule} from './components/product-rating/product-rating.module';
import {ProductUpSellingModule} from './components/product-upselling/product-upselling.module';
import {ProductVariationModule} from './components/product-variation/product-vatiation.module';
import {QuickViewModule} from './components/quickview/quickview.module';
import {SearchFormModule} from './components/search-form/search-form.module';
import {SearchPaginationModule} from './components/search-pagination/search-pagination.module';
import {SearchVehicleModule} from './components/search-vehicle/search-vehicle.module';
import {SelfColorModule} from './components/self-color/self-color.module';
import {ServiceModule} from './components/service/service.module';
import {ShippingCalcModule} from './components/shipping/shipping.module';
import {ShowcaseBannerModule} from './components/showcase-banner/showcase-banner.module';
import {ShowcaseGroupModule} from './components/showcase-group/showcase-group.module';
import {SignUpModule} from './components/login/signup.module';
import {UserEditModule} from './components/account-user-edit-panel/user-edit.module';
import {VouncherPanelModule} from './components/account-vouncher-panel/vouncher-panel.module';

/* Essentials */
import {AppSettings} from './app.settings';
import {CurrencyFormatModule} from './pipes/currency-format.module';
import {HttpClient} from './helpers/httpclient';
import {OrderByModule} from './pipes/orderBy.module';
import {NgProgressModule} from 'ngx-progressbar';
import {NgProgressCustomBrowserXhr} from "ngx-progressbar";
import {routing} from './app.routes';

/* Directives */
import {CnpjMaskModule} from './directives/cnpj-mask/cnpj-mask.module';
import {CpfMaskModule} from './directives/cpf-mask/cpf-mask.module';
import {PhoneMaskModule} from './directives/phone-mask/phone-mask.module';
import {ZipCodeMaskModule} from './directives/zipcode-mask/zipcode-mask.module';

/* Services */
import {BannerService} from './services/banner.service';
import {BranchService} from './services/branch.service';
import {BrandService} from './services/brand.service';
import {BudgetService} from './services/budget.service';
import {CartService} from './services/cart.service';
import {CategoryService} from './services/category.service';
import { ContactService } from './services/contact.service';
import {CouponService} from './services/coupon.service';
import {CustomerService} from './services/customer.service';
import {DneAddressService} from './services/dneaddress.service';
import {FipeService} from './services/fipe.service';
import { FormHelper } from './helpers/formhelper';
import {GoogleService} from './services/google.service';
import {GroupService} from './services/group.service';
import {IntelipostService} from "./services/intelipost.service";
import {InstitutionalService} from './services/institutional.service';
import {NewsLetterService} from './services/newsletter.service';
import {OrderService} from './services/order.service';
import {PaymentService} from './services/payment.service';
import {PopUpService} from './services/pop-up.service';
import {ProductService} from './services/product.service';
import {SearchService} from './services/search.service';
import {SelfColorService} from './services/self-color.service';
import {ServiceService} from './services/service.service';
import {ShowCaseService} from './services/showcase.service';
import {StoreService} from './services/store.service';

/* Managers */
import { CartManager } from './managers/cart.manager';

@NgModule({
    imports: [
        AddressPanelListModule,
        AddressPanelModule,
        BannerModule,
        BannerSideModule,
        BrandNavModule,
        BrowserModule, 
        BreadcrumpModule,
        CartShowCaseModule,
        CategoryNavModule,
        CheckoutButtonModule,
        CnpjMaskModule,
        CouponModule,
        CpfMaskModule,
        CurrencyFormatModule,
        FormsModule,
        GroupModule,
        HttpModule, 
        InstallmentSimulationModule,
        LoginEmbedModule,
        MiniCartModule, 
        MyOrderPanelModule,
        NewAddressModule,
        NewsLetterModule,
        NgProgressModule,
        OrderByModule,
        OrderPanelModule,
        PaymentMundipaggModule,
        PaymentPagseguroModule,
        PhoneMaskModule,
        PopUpModule,
        ProductCrossSellingModule,
        ProductGalleryModule,
        ProductUpSellingModule,
        ProductGridItemModule,
        ProductRatingModule,
        ProductVariationModule, 
        QuickViewModule,
        ReactiveFormsModule,
        RouterModule,
        routing,
        SearchFormModule,
        SearchPaginationModule,
        SearchVehicleModule,
        SelfColorModule,
        ServiceModule,
        ShippingCalcModule,
        SignUpModule,
        ShowcaseBannerModule,
        ShowcaseGroupModule,
        UserEditModule,
        VouncherPanelModule,
        ZipCodeMaskModule,
    ],
    declarations: [
        AccountComponent,
        AppComponent,
        BudgetComponent,
        BudgetFinishComponent,
        CartComponent,
        CheckoutComponent,
        CheckoutFinishComponent,
        ContactComponent,
        CompareComponent,
        ForgetPasswordComponent,
        InstitutionalComponent,
        NotFoundComponent,
        LoginComponent,
        LogoutComponent,
        ProductComponent,
        SearchComponent,
        ShowCaseComponent,
    ],
    providers: [
        HttpClient,
        { provide: BrowserXhr, useClass: NgProgressCustomBrowserXhr } ,
        BannerService,
        BranchService, 
        BrandService,
        BudgetService,
        CartManager,
        CartService,
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
        SearchService,
        SelfColorService,
        ServiceService,
        ShowCaseService,
        StoreService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}