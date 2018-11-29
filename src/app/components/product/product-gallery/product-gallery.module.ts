import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlickModule } from 'ngx-slick';
import { ProductGalleryComponent } from './product-gallery.component';
import { CampaignModule } from '../../shared/campaign/campaign.module';

@NgModule({
    declarations: [ProductGalleryComponent],
    imports: [CommonModule, SlickModule.forRoot(), CampaignModule],
    exports: [ProductGalleryComponent]
})
export class ProductGalleryModule { }