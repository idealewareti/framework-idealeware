import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CompareComponent } from "./compare/compare.component";
import { ProductGridItemModule } from "../shared/product-grid-item/product-grid-item.module";
import { FormsModule } from "@angular/forms";
import { CurrencyFormatModule } from "../../pipes/currency-format/currency-format.module";

@NgModule({
    declarations: [
        CompareComponent
    ],
    imports: [
        RouterModule.forChild([
            { path: '', component: CompareComponent },
        ]),
        CommonModule,
        FormsModule,
        CurrencyFormatModule,
        ProductGridItemModule
    ]
})
export class CompareModule { }