import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RelatedProductsComponent }  from './related-product.component';

@NgModule({
    declarations: [ RelatedProductsComponent ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ RelatedProductsComponent ]
})
export class RelatedProductsModule {}