import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRatingComponent } from './product-rating.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { LoginEmbedModule } from '../../shared/login-embed/login-embed.module';
import { ProductRatingService } from '../../../services/product-rating.service';

@NgModule({
    declarations: [ ProductRatingComponent ],
    imports: [ CommonModule, ReactiveFormsModule, FormsModule, LoginEmbedModule, RouterModule ],
    providers: [ProductRatingService],
    exports: [ ProductRatingComponent ]
})
export class ProductRatingModule {}