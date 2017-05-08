import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProductRatingComponent } from './product-rating.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [ ProductRatingComponent ],
    imports: [ BrowserModule, ReactiveFormsModule, FormsModule ],
    providers: [],
    exports: [ ProductRatingComponent ]
})
export class ProductRatingModule {}