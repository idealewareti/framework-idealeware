import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCrossSellingComponent }  from './product-cross-selling.component';
import { ProductGridItemModule } from '../../shared/product-grid-item/product-grid-item.module';

@NgModule({
    declarations: [ ProductCrossSellingComponent ],
    imports: [ CommonModule, ProductGridItemModule ],
    exports: [ ProductCrossSellingComponent ]
})
export class ProductCrossSellingModule {}