// ______                
// | ___ \               
// | |_/ / __ _ ___  ___ 
// | ___ \/ _` / __|/ _ \
// | |_/ / (_| \__ \  __/
// \____/ \__,_|___/\___|
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, BrowserXhr } from '@angular/http';
import { RouterModule } from '@angular/router';
import 'rxjs/Rx';

//  _____                                              _       
// /  __ \                                            | |      
// | /  \/ ___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_ ___ 
// | |    / _ \| '_ ` _ \| '_ \ / _ \| '_ \ / _ \ '_ \| __/ __|
// | \__/\ (_) | | | | | | |_) | (_) | | | |  __/ | | | |_\__ \
//  \____/\___/|_| |_| |_| .__/ \___/|_| |_|\___|_| |_|\__|___/
//                       | |                                   
//                       |_|                                   
import { AppComponent } from './app.component';
import { BudgetComponent } from './components/budget/budget.component';
import { BudgetFinishComponent } from './components/budget-finish/budget-finish.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CheckoutFinishComponent } from "./components/checkout-finish/checkout-finish.component";
import { CompareComponent } from './components/compare/compare.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { InstitutionalComponent } from './components/institutional/institutional.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { NotFoundComponent } from './components/404/404.component';
import { ProductComponent } from './components/product/product.component';
import { RedirectComponent } from './components/redirect/redirect.component';
import { SearchComponent } from './components/search/search.component';
import { ShowCaseComponent } from './components/showcase/showcase.component';
import { SignUpComponent } from './components/signup/signup.component';

// ___  ___          _       _           
// |  \/  |         | |     | |          
// | .  . | ___   __| |_   _| | ___  ___ 
// | |\/| |/ _ \ / _` | | | | |/ _ \/ __|
// | |  | | (_) | (_| | |_| | |  __/\__ \
// \_|  |_/\___/ \__,_|\__,_|_|\___||___/
import { BannerModule } from './components/banner/banner.module';
import { BannerSideModule } from './components/banner/banner-side.module';
import { BrandNavModule } from './components/brand-nav/brand-nav.module';
import { BreadcrumpModule } from './components/breadcrump/breadcrump.module';
import { CartShowCaseModule } from './components/cart-showcase/cart-showcase.module';
import { CategoryNavModule } from './components/category-nav/category-nav.module';
import { ContactModule } from './components/contact/contact.module';
import { CouponModule } from './components/coupon/coupon.module';
import { CheckoutButtonModule } from './components/checkout-button/checkout-button.module';
import { GroupModule } from './components/group/group.module';
import { InstallmentSimulationModule } from './components/installment-simulation/installment-simulation.module';
import { LoginEmbedModule } from './components/login-embed/login-embed.module';
import { PaymentMercadoPagoModule } from './components/checkout-payment-mercadopago/payment-mercadopago.module'; 
import { MiniCartModule } from './components/cart-mini/mini-cart.module';
import { NewsLetterModule } from './components/newsletter/newsletter.module';
import { MundiPaggBankslipModule } from './components/checkout-payment-mundipagg/mundipagg-bankslip/mundipagg-bankslip.module';
import { MundipaggCreditCardModule } from './components/checkout-payment-mundipagg/mundipagg-creditcard/mundipagg-creditcard.module';
import { PaymentPagseguroModule} from './components/checkout-payment-pagseguro/payment-pagseguro.module';
import { PaymentPickuUpStoreModule } from './components/checkout-payment-pickupstore/payment-pickupstore.module';
import { PopUpModule} from './components/pop-up/popup.module';
import { ProductCrossSellingModule } from './components/product-cross-selling/product-cross-selling.module';
import { ProductGalleryModule } from './components/product-gallery/product-gallery.module';
import { ProductGridItemModule } from './components/product-grid-item/product-grid-item.module';
import { ProductRatingModule } from './components/product-rating/product-rating.module';
import { ProductUpSellingModule } from './components/product-upselling/product-upselling.module';
import { ProductVariationModule } from './components/product-variation/product-vatiation.module';
import { QuickViewModule } from './components/quickview/quickview.module';
import { RelatedProductsModule } from './components/product-related/related-product.module'
import { SearchPaginationModule } from './components/search-pagination/search-pagination.module';
import { SearchVehicleModule } from './components/search-vehicle/search-vehicle.module';
import { SelfColorModule } from './components/self-color/self-color.module';
import { ServiceModule } from './components/service/service.module';
import { ShippingCalcModule } from './components/shipping/shipping.module';
import { ShowcaseBannerModule } from './components/showcase-banner/showcase-banner.module';
import { ShowcaseBannerHalfModule } from './components/showcase-banner-half/showcase-banner-half.module';
import { ShowcaseBannerStripeModule } from './components/showcase-banner-stripe/showcase-banner-stripe.module';
import { ShowcaseGroupModule } from './components/showcase-group/showcase-group.module';
import { WaitLoaderModule } from './components/wait-loader/wait-loader.module'
//  _____                   _   _       _     
// |  ___|                 | | (_)     | |    
// | |__ ___ ___  ___ _ __ | |_ _  __ _| |___ 
// |  __/ __/ __|/ _ \ '_ \| __| |/ _` | / __|
// | |__\__ \__ \  __/ | | | |_| | (_| | \__ \
// \____/___/___/\___|_| |_|\__|_|\__,_|_|___/
import { AppSettings } from './app.settings';
import { CurrencyFormatModule } from './pipes/currency-format/currency-format.module';
import { HttpClient } from './helpers/httpclient';
import { OrderByModule } from './pipes/orderBy/orderBy.module';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressBrowserXhr } from "ngx-progressbar";
import { routing } from './app.routes';

// ______ _               _   _                
// |  _  (_)             | | (_)               
// | | | |_ _ __ ___  ___| |_ ___   _____  ___ 
// | | | | | '__/ _ \/ __| __| \ \ / / _ \/ __|
// | |/ /| | | |  __/ (__| |_| |\ V /  __/\__ \
// |___/ |_|_|  \___|\___|\__|_| \_/ \___||___/
import { CnpjMaskModule } from './directives/cnpj-mask/cnpj-mask.module';
import { CpfMaskModule } from './directives/cpf-mask/cpf-mask.module';
import { PhoneMaskModule } from './directives/phone-mask/phone-mask.module';
import { ZipCodeMaskModule } from './directives/zipcode-mask/zipcode-mask.module';

//  _____                 _               
// /  ___|               (_)              
// \ `--.  ___ _ ____   ___  ___ ___  ___ 
//  `--. \/ _ \ '__\ \ / / |/ __/ _ \/ __|
// /\__/ /  __/ |   \ V /| | (_|  __/\__ \
// \____/ \___|_|    \_/ |_|\___\___||___/
import { BannerService } from './services/banner.service';
import { BranchService } from './services/branch.service';
import { BrandService } from './services/brand.service';
import { BudgetService } from './services/budget.service';
import { CartService } from './services/cart.service';
import { CategoryService } from './services/category.service';
import { ContactService } from './services/contact.service';
import { CouponService } from './services/coupon.service';
import { CustomerService } from './services/customer.service';
import { DneAddressService } from './services/dneaddress.service';
import { FipeService } from './services/fipe.service';
import { FormHelper } from './helpers/formhelper';
import { GoogleService } from './services/google.service';
import { GroupService } from './services/group.service';
import { IntelipostService } from "./services/intelipost.service";
import { InstitutionalService } from './services/institutional.service';
import { NewsLetterService } from './services/newsletter.service';
import { OrderService } from './services/order.service';
import { PaymentService } from './services/payment.service';
import { PopUpService } from './services/pop-up.service';
import { ProductService } from './services/product.service';
import { Redirect301Service } from './services/redirect301.service';
import { RelatedProductsService } from './services/related-products.service';
import { SearchService } from './services/search.service';
import { SelfColorService } from './services/self-color.service';
import { ServiceService } from './services/service.service';
import { ShowCaseService } from './services/showcase.service';
import { StoreService } from './services/store.service';

// ___  ___                                      
// |  \/  |                                      
// | .  . | __ _ _ __   __ _  __ _  ___ _ __ ___ 
// | |\/| |/ _` | '_ \ / _` |/ _` |/ _ \ '__/ __|
// | |  | | (_| | | | | (_| | (_| |  __/ |  \__ \
// \_|  |_/\__,_|_| |_|\__,_|\__, |\___|_|  |___/
//                            __/ |              
//                           |___/               
import { CartManager } from './managers/cart.manager';
import { CustomerManager } from './managers/customer.manager';
import { PaymentManager } from './managers/payment.manager';

//  _____ _       _           _ 
// |  __ \ |     | |         | |
// | |  \/ | ___ | |__   __ _| |
// | | __| |/ _ \| '_ \ / _` | |
// | |_\ \ | (_) | |_) | (_| | |
//  \____/_|\___/|_.__/ \__,_|_|
import { Globals } from './models/globals';

@NgModule({
    imports: [
        BannerModule,
        BannerSideModule,
        BrandNavModule,
        BrowserModule, 
        BreadcrumpModule,
        CartShowCaseModule,
        CategoryNavModule,
        CheckoutButtonModule,
        CnpjMaskModule,
        ContactModule,
        CouponModule,
        CpfMaskModule,
        CurrencyFormatModule,
        FormsModule,
        GroupModule,
        HttpModule, 
        InstallmentSimulationModule,
        LoginEmbedModule,
        MiniCartModule, 
        MundiPaggBankslipModule,
        MundipaggCreditCardModule,
        NewsLetterModule,
        NgProgressModule,
        OrderByModule,
        PaymentMercadoPagoModule,
        PaymentPagseguroModule,
        PaymentPickuUpStoreModule,
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
        RelatedProductsModule,
        RouterModule,
        routing,
        SearchPaginationModule,
        SearchVehicleModule,
        SelfColorModule,
        ServiceModule,
        ShippingCalcModule,
        ShowcaseBannerModule,
        ShowcaseBannerHalfModule,
        ShowcaseBannerStripeModule,
        ShowcaseGroupModule,
        ZipCodeMaskModule,
        WaitLoaderModule
    ],
    declarations: [
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
        RedirectComponent,
        SearchComponent,
        ShowCaseComponent,
        SignUpComponent
    ],
    providers: [
        HttpClient,
        { provide: BrowserXhr, useClass: NgProgressBrowserXhr } ,
        BannerService,
        BranchService, 
        BrandService,
        BudgetService,
        CartManager,
        CartService,
        CategoryService,
        ContactService,
        CouponService,
        CustomerManager,
        CustomerService,
        DneAddressService,
        FipeService,
        FormHelper,
        Globals,
        GoogleService,
        GroupService,
        InstitutionalService,
        IntelipostService,
        NewsLetterService,
        OrderService,
        PaymentService,
        PaymentManager,
        PopUpService,
        ProductService,
        Redirect301Service,
        RelatedProductsService,
        SearchService,
        SelfColorService,
        ServiceService,
        ShowCaseService,
        StoreService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}