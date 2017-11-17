import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProductRatingComponent } from './product-rating.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { LoginEmbedModule } from '../../shared/login-embed/login-embed.module';

@NgModule({
    declarations: [ ProductRatingComponent ],
    imports: [ BrowserModule, ReactiveFormsModule, FormsModule, LoginEmbedModule, RouterModule ],
    providers: [],
    exports: [ ProductRatingComponent ]
})
export class ProductRatingModule {}