import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProductShipping } from "./product-shipping/product-shipping.component";
import { ProductComponent } from "./product/product.component";
import { BreadcrumpModule } from "../shared/breadcrump/breadcrump.module";
import { ProductGalleryModule } from "./product-gallery/product-gallery.module";
import { RelatedProductsModule } from "./product-related/related-product.module";
import { ProductVariationModule } from "./product-variation/product-vatiation.module";
import { ServiceModule } from "./service/service.module";
import { ProductUpSellingModule } from "./product-upselling/product-upselling.module";
import { ProductCrossSellingModule } from "./product-cross-selling/product-cross-selling.module";
import { WaitLoaderModule } from "../shared/wait-loader/wait-loader.module";
import { CommonModule } from "@angular/common";
import { CurrencyFormatModule } from "../../pipes/currency-format/currency-format.module";
import { ProductRatingModule } from "./product-rating/product-rating.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ZipCodeMaskModule } from "../../directives/zipcode-mask/zipcode-mask.module";
import { InstallmentSimulationModule } from "../shared/installment-simulation/installment-simulation.module";
import { ProductResolver } from "../../resolvers/product.resolver";
import { StoreResolver } from "../../resolvers/store.resolver";
import { PaymentTicketModule } from "../shared/payment-ticket/payment-ticket.module";
import { CampaignModule } from "../shared/campaign/campaign.module";

@NgModule({
    declarations: [
        ProductShipping,
        ProductComponent,
    ],
    imports: [
        RouterModule.forChild([
            {
                path: '', component: ProductComponent, resolve: {
                    product: ProductResolver,
                    store: StoreResolver
                }
            },
        ]),
        BreadcrumpModule,
        ProductGalleryModule,
        RelatedProductsModule,
        ProductVariationModule,
        InstallmentSimulationModule,
        ServiceModule,
        ProductCrossSellingModule,
        ProductUpSellingModule,
        WaitLoaderModule,
        CommonModule,
        CurrencyFormatModule,
        ProductRatingModule,
        FormsModule,
        ReactiveFormsModule,
        ZipCodeMaskModule,
        PaymentTicketModule,
        CampaignModule
    ]
})
export class ProductModule { }