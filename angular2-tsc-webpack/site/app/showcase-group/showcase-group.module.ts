import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import { ShowcaseGroupComponent } from './showcase-group.component';
import { ProductGridItemModule } from "../product-grid-item/product_grid_item.module";

@NgModule({
    declarations: [ ShowcaseGroupComponent ],
    imports: [ 
        RouterModule, 
        BrowserModule, 
        FormsModule, 
        ProductGridItemModule,
    ],
    providers: [],
    exports: [ ShowcaseGroupComponent ]
})
export class ShowcaseGroupModule {}