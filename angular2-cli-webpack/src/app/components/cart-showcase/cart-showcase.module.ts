import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CartShowCaseComponent }  from './cart-showcase.component';
import { ProductGridItemModule } from "app/components/product-grid-item/product-grid-item.module";

@NgModule({
    declarations: [ CartShowCaseComponent ],
    imports: [ BrowserModule, ProductGridItemModule ],
    providers: [],
    exports: [ CartShowCaseComponent ]
})
export class CartShowCaseModule {}