import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProductVariationComponent }  from './product-variation.component';

@NgModule({
    declarations: [ ProductVariationComponent ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ ProductVariationComponent ]
})
export class ProductVariationModule {}