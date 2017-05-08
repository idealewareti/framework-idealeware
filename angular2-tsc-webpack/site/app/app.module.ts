/* Base */
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, BrowserXhr} from '@angular/http';
import {RouterModule} from '@angular/router';
import 'rxjs/add/operator/map';

/* Components */
import {AccountComponent} from './account/account.component';
import {AppComponent} from './app.component';
import {BudgetComponent} from './budget/budget.component';
import {BudgetFinishComponent} from './budget-finish/budget-finish.component';
import {CartComponent} from './cart/cart.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {CheckoutFinishComponent} from "./checkout-finish/checkout-finish.component";
import {CompareComponent} from './compare/compare.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {InstitutionalComponent} from './institutional/institutional.component';
import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './login/logout.component';
import {NotFoundComponent} from './404/404.component';
import {ProductComponent} from './product/product.component';
import {SearchComponent} from './search/search.component';
import {ShowCaseComponent} from './showcase/showcase.component';
import {SearchVehicleComponent} from './vehicle/searchVehicle.component';

/* Modules */
import {AddressPanelListModule} from './account/address-panel/address-panel-list.module';
import {AddressPanelModule} from './account/address-panel/address-panel.module';
import {BannerModule} from './banner/banner.module';
import {BannerSideModule} from './banner/banner-side.module';
import {BrandNavModule} from './brand_nav/brand_nav.module';
import {BreadcrumpModule} from './breadcrump/breadcrump.module';
import {CartShowCaseModule} from './cart-showcase/cart-showcase.module';
import {CategoryNavModule} from './category_nav/category_nav.module';
import {CouponModule} from './coupon/coupon.module';
import {CheckoutButtonModule} from './checkout-button/checkout-button.module';
import {GroupModule} from './group/group.module';
import {InstallmentSimulationModule} from './product-simulation/installment-simulation.module';
import {MiniCartModule} from './cart-mini/mini-cart.module';
import {MyFooterModule} from './store-footer/myfooter.module';
import {MyHeaderModule} from './store-header/myheader.module';
import {MyOrderPanelModule} from './account/orders-panel/myorder-panel.module';
import {NewAddressModule} from './account/address-panel/address-edit.module';
import {NewsLetterModule} from './newsletter/newsletter.module';
import {OrderPanelModule} from './account/orders-panel/orders-panel.module';
import {PaymentMundipaggModule} from './checkout-payment-mundipagg/payment-mundipagg.module';
import {PaymentPagseguroModule} from './checkout-payment-pagseguro/payment-pagseguro.module';
import {PopUpModule} from './pop-up/popup.module';
import {ProductCrossSellingModule} from './product-cross-selling/cross-selling.module';
import {ProductGalleryModule} from './product-gallery/product-gallery.module';
import {ProductGridItemModule} from './product-grid-item/product_grid_item.module';
import {ProductRatingModule} from './product-rating/product-rating.module';
import {ProductUpSellingModule} from './product-upselling/upselling.module';
import {QuickViewModule} from './quickview/quickview.module';
import {SearchFormModule} from './search-form/search-form.module';
import {SearchVehicleModule} from './vehicle/searchVehicle.module';
import {SelfColorModule} from './self-color/self-color.module';
import {ServiceModule} from './service/service.module';
import {ShippingCalcModule} from './shipping/shipping.module';
import {ShowcaseBannerModule} from './showcase-banner/showcase-banner.module';
import {ShowcaseGroupModule} from './showcase-group/showcase-group.module';
import {SignUpModule} from './login/signup.module';
import {UserEditModule} from './account/user-edit-panel/user-edit.module';
import {VouncherPanelModule} from './account/vouncher-panel/vouncher-panel.module';

/* Essentials */
import {AppSettings} from './app.settings';
import {CurrencyFormatModule} from './_pipes/currency-format.module';
import {HttpClient} from './httpclient';
import {LoadingIndicatorModule} from './loading-indicator/loading.module';
import {OrderByModule} from './_pipes/orderBy.module';
import {NgProgressModule} from 'ngx-progressbar';
import {NgProgressCustomBrowserXhr} from "ngx-progressbar";
import {routing} from './app.routes';

/* Directives */
import {CnpjMaskModule} from './_directives/cnpj-mask/cnpj-mask.module';
import {CpfMaskModule} from './_directives/cpf-mask/cpf-mask.module';
import {PhoneMaskModule} from './_directives/phone-mask/phone-mask.module';
import {ZipCodeMaskModule} from './_directives/zipcode-mask/zipcode-mask.module';

/* Services */
import {BannerService} from './_services/banner.service';
import {BranchService} from './_services/branch.service';
import {BrandService} from './_services/brand.service';
import {BudgetService} from './_services/budget-service';
import {CartService} from './_services/cart.service';
import {CategoryService} from './_services/category.service';
import {CouponService} from './_services/coupon.service';
import {CustomerService} from './_services/customer.service';
import {DneAddressService} from './_services/dneaddress.service';
import {FipeService} from './_services/fipe.service';
import {GoogleService} from './_services/google.service';
import {GroupService} from './_services/group.service';
import {IntelipostService} from "./_services/intelipost.service";
import {InstitutionalService} from './_services/institutional.service';
import {NewsLetterService} from './_services/news-letter.service';
import {OrderService} from './_services/order.service';
import {PaymentService} from './_services/payment.service';
import {PopUpService} from './_services/pop-up.service';
import {ProductService} from './_services/product.service';
import {SearchService} from './_services/search.service';
import {SelfColorService} from './_services/self-color.service';
import {ServiceService} from './_services/service.service';
import {ShowCaseService} from './_services/showcase.service';
import {StoreService} from './_services/store.service';

/* Managers */
import { CartManager } from './_managers/cart.manager';

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
        LoadingIndicatorModule,
        MiniCartModule, 
        MyFooterModule, 
        MyHeaderModule, 
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
        QuickViewModule,
        ReactiveFormsModule,
        RouterModule,
        routing,
        SearchFormModule,
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
        CompareComponent,
        ForgetPasswordComponent,
        InstitutionalComponent,
        NotFoundComponent,
        LoginComponent,
        LogoutComponent,
        ProductComponent,
        SearchComponent,
        ShowCaseComponent
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
        CouponService,
        CustomerService,
        DneAddressService,
        FipeService,
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