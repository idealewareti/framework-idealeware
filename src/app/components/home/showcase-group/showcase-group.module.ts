import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseGroupComponent } from './showcase-group.component';
import { ProductGridItemModule } from '../../shared/product-grid-item/product-grid-item.module';

@NgModule({
    declarations: [ ShowcaseGroupComponent ],
    imports: [ CommonModule, ProductGridItemModule ],
    exports: [ ShowcaseGroupComponent ],
    providers: [],
})
export class ShowcaseGroupModule {}