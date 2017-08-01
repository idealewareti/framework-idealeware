import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ProductCrossSellingComponent }  from './product-cross-selling.component';
import { ProductGridItemModule } from "app/components/product-grid-item/product-grid-item.module";

@NgModule({
    declarations: [ ProductCrossSellingComponent ],
    imports: [ BrowserModule, ProductGridItemModule ],
    exports: [ ProductCrossSellingComponent ]
})
export class ProductCrossSellingModule {}