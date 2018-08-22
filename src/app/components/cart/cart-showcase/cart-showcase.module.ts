import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartShowCaseComponent } from './cart-showcase.component';
import { ProductGridItemModule } from '../../shared/product-grid-item/product-grid-item.module';
import { CartShowcaseManager } from '../../../managers/cart-showcase.manager';

@NgModule({
    declarations: [CartShowCaseComponent],
    imports: [CommonModule, ProductGridItemModule],
    providers: [CartShowcaseManager],
    exports: [CartShowCaseComponent]
})
export class CartShowCaseModule { }