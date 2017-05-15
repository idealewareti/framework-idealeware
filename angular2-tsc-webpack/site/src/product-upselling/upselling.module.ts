import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ProductUpSellingComponent }  from './upselling.component';
import {ProductGridItemModule} from '../product-grid-item/product_grid_item.module';

@NgModule({
    declarations: [ ProductUpSellingComponent ],
    imports: [ BrowserModule, ProductGridItemModule ],
    exports: [ ProductUpSellingComponent ]
})
export class ProductUpSellingModule {}