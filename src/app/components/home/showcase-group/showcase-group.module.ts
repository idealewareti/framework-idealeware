import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseGroupComponent } from './showcase-group.component';
import { ProductGridItemModule } from '../../shared/product-grid-item/product-grid-item.module';
import { ShowcaseGroupProductComponent } from '../showcase-group-product/showcase-group-product.component';

@NgModule({
    declarations: [ ShowcaseGroupComponent, ShowcaseGroupProductComponent ],
    imports: [ CommonModule, ProductGridItemModule ],
    exports: [ ShowcaseGroupComponent, ShowcaseGroupProductComponent ],
    providers: [],
})
export class ShowcaseGroupModule {}