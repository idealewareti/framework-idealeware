import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProductRatingComponent } from './product-rating.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginEmbedModule } from "../login-embed/login-embed.module";
import { RouterModule } from "@angular/router";

@NgModule({
    declarations: [ ProductRatingComponent ],
    imports: [ BrowserModule, ReactiveFormsModule, FormsModule, LoginEmbedModule, RouterModule ],
    providers: [],
    exports: [ ProductRatingComponent ]
})
export class ProductRatingModule {}