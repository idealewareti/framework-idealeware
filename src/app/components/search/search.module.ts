import { NgModule } from "@angular/core";
import { SearchComponent } from "./search/search.component";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ProductGridItemModule } from "../shared/product-grid-item/product-grid-item.module";
import { FormsModule } from "@angular/forms";
import { CurrencyFormatModule } from "../../pipes/currency-format/currency-format.module";
import { BannerModule } from "./banner/banner.module";
import { BannerSideModule } from "./banner-side/banner-side.module";
import { SearchPaginationModule } from "./search-pagination/search-pagination.module";
import { BreadcrumpModule } from "../shared/breadcrump/breadcrump.module";
import { WaitLoaderModule } from "../shared/wait-loader/wait-loader.module";
import { SearchResolver } from "../../resolvers/search.resolver";
import { StoreResolver } from "../../resolvers/store.resolver";

@NgModule({
    declarations: [
        SearchComponent
    ],
    imports: [
        RouterModule.forChild([
            {
                path: '', component: SearchComponent, resolve: {
                    search: SearchResolver,
                    store: StoreResolver
                }
            },
        ]),
        CommonModule,
        FormsModule,
        CurrencyFormatModule,
        BreadcrumpModule,
        BannerModule,
        WaitLoaderModule,
        ProductGridItemModule,
        BannerSideModule,
        SearchPaginationModule
    ]
})
export class SearchModule { }