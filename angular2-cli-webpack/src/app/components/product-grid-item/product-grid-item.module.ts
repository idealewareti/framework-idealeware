import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import { ProductGridItemComponent } from './product-grid-item.component';
import { CurrencyFormatModule } from "app/pipes/currency-format/currency-format.module";
import { QuickViewModule } from "../quickview/quickview.module";

@NgModule({
    imports: [ 
        RouterModule, 
        BrowserModule, 
        FormsModule, 
        CurrencyFormatModule, 
        QuickViewModule 
    ],
    declarations: [ProductGridItemComponent],
    exports: [ProductGridItemComponent]
})
export class ProductGridItemModule {}