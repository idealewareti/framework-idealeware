import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGridItemComponent } from './product-grid-item.component';
import { RouterModule } from '@angular/router';
import { CurrencyFormatModule } from '../../../pipes/currency-format/currency-format.module';

@NgModule({
    declarations: [ ProductGridItemComponent ],
    imports: [ CommonModule, RouterModule, CurrencyFormatModule ],
    exports: [ ProductGridItemComponent ],
    providers: [],
})
export class ProductGridItemModule {}