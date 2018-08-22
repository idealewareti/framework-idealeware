import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlickModule } from 'ngx-slick';
import { ProductGalleryComponent } from './product-gallery.component';

@NgModule({
    declarations: [ProductGalleryComponent],
    imports: [CommonModule, SlickModule.forRoot()],
    exports: [ProductGalleryComponent]
})
export class ProductGalleryModule { }