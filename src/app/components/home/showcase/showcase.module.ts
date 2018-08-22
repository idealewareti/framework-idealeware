import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ShowcaseComponent } from "./showcase.component";
import { ShowcaseBannerHalfComponent } from "./showcase-banner-half.component";
import { ShowcaseBannerStripeComponent } from "./showcase-banner-stripe.component";
import { ShowcaseGroupComponent } from "./showcase-group.component";
import { ShowcaseGroupProductComponent } from "./showcase-group-product.component";
import { ShowcaseBannerComponent } from "./showcase-banner.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { BrandNavComponent } from "../brand-nav/brand-nav.component";
import { ProductGridItemModule } from "../../shared/product-grid-item/product-grid-item.module";

@NgModule({
    declarations: [
        ShowcaseComponent,
        ShowcaseBannerComponent,
        ShowcaseBannerHalfComponent,
        ShowcaseBannerStripeComponent,
        ShowcaseGroupComponent,
        ShowcaseGroupProductComponent,
        BrandNavComponent
    ],
    imports: [
        RouterModule.forChild([
            { path: '', component: ShowcaseComponent, data: { name: 'Home' } },
        ]),
        FormsModule,
        CommonModule,
        ProductGridItemModule
    ]
})
export class ShowcaseModule { }