import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProductGalleryComponent }  from './product-gallery.component';

@NgModule({
    declarations: [ ProductGalleryComponent ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ ProductGalleryComponent ]
})
export class ProductGalleryModule {}