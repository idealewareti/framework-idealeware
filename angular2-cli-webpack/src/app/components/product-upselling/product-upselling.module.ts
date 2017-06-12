import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ProductUpSellingComponent }  from './product-upselling.component';
import { ProductGridItemModule } from "app/components/product-grid-item/product-grid-item.module";

@NgModule({
    declarations: [ ProductUpSellingComponent ],
    imports: [ BrowserModule, ProductGridItemModule ],
    exports: [ ProductUpSellingComponent ]
})
export class ProductUpSellingModule {}