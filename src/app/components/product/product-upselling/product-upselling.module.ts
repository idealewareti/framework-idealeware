import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductUpSellingComponent }  from './product-upselling.component';
import { ProductGridItemModule } from '../../shared/product-grid-item/product-grid-item.module';

@NgModule({
    declarations: [ ProductUpSellingComponent ],
    imports: [ CommonModule, ProductGridItemModule ],
    exports: [ ProductUpSellingComponent ]
})
export class ProductUpSellingModule {}