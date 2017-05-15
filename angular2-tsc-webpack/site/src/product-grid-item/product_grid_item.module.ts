import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import { ProductGridItemComponent } from './product_grid_item.component';
import { CurrencyFormatPipe } from "../_pipes/currency-format.pipe";
import { CurrencyFormatModule } from "../_pipes/currency-format.module";
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